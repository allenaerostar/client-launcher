const request = require('request-promise');
const cookie = require('cookie');
const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');
const keytar = require('keytar');
const app = require('electron').app;
const aes256 = require('helpers/aes256');

const config = require('config.json');
const secret = config.SECRET;
const djangoUrl = config.DJANGO_SERVER.HOST +":" +config.DJANGO_SERVER.PORT;

// REGULAR LOGIN WITH USERNAME AND PASSWORD
const login = cred => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      uri: djangoUrl +'/accounts/login/',
      header: {'content-type': 'application/x-www-form-urlencoded'},
      form: cred,
      resolveWithFullResponse: true,
      json: true
    }
    
    let body;
    let encryptedPassword;

    aes256.encrypt(cred.password).then(encrypted => {
      encryptedPassword = encrypted;
    })
    // SEND POST REQUEST TO LOGIN
    .then(() => {
      return request(options).then(response => {
        body = response.body;
        return response.headers['set-cookie'];
      })
      .catch(error => {
        throw error.error;
      });
    })
    // PARSE Set-Cookie HEADER INTO COOKIE OBJECTS
    .then(cookieStrings => {
      let promises = [];

      for(cookieString of cookieStrings){
        promises.push(new Promise((resolve, reject) => {
          resolve(cookie.parse(cookieString));
        }));
      }

      return Promise.all(promises).then(cookies => {
        return cookies;
      });
    })
    // SAVES USERNAME, PASSWORD, CSRF TOKEN, SESSION TOKEN IN OPERATING SYSTEM'S PASSWORD VAULT
    .then(cookies => {
      let promises = [];
      let expiry = 0;

      promises.push(keytar.setPassword('Dietstory', body.name, encryptedPassword));
      for(cookieObject of cookies){
        if(cookieObject.hasOwnProperty('csrftoken')){
          csrfToken = cookieObject.csrftoken;   // GLOBAL VARIABLE
          promises.push(keytar.setPassword('Dietstory_CSRF', body.name, cookieObject.csrftoken));
        }
        else if(cookieObject.hasOwnProperty('sessionid')){
          sessionKey = cookieObject.sessionid;  // GLOBAL VARIABLE
          promises.push(keytar.setPassword('Dietstory_Session', body.name, cookieObject.sessionid));
          expiry = Date.parse(cookieObject.expires);
        }
      }
      
      return Promise.all(promises).then(() => {
        return expiry;
      })
      .catch(error => {
        throw error;
      });
    })
    // SAVE USER INFO FOR FUTURE AUTO-LOGIN TO USE (ENCRYPTED)
    .then(expiry => {
      sessionExpiry = expiry;   // GLOBAL VARIABLE
      let userInfo = {...body, session_expiry: expiry};

      return aes256.encrypt(JSON.stringify(userInfo)).then(encryptedData => {
        fs.writeFileSync(path.join(app.getPath('userData'), 'user_info'), encryptedData, 'utf-8');
        return userInfo;
      })
      .catch(error => {
        throw error;
      });
    })
    // RETURNS DJANGO RESPONSE BODY
    .then(userInfo => {
      resolve({body: body, userInfo: userInfo});
    })
    .catch(error => {
      reject(error);
    });
  });
}






// AUTO LOGIN
const autoLogin = () => {
  return new Promise((resolve, reject) => {
    // READ AND DECRYPT user_info FILE
    fs.readFile(path.join(app.getPath('userData'), 'user_info'), 'utf-8').then(encryptedData => {
      return aes256.decrypt(encryptedData).then(userInfo => {
        return JSON.parse(userInfo);
      });
    })
    // GET USER'S PASSWORD
    .then(userInfo => {
      return keytar.getPassword('Dietstory', userInfo.name).then(password => {
        return aes256.decrypt(password).then(decryptedPassword => {
          return {...userInfo, password: decryptedPassword};
<<<<<<< HEAD
        });
=======
        })
>>>>>>> created new helper file for encrypt/decrypt. Added encryption to password before storing in Credential manager.
      })
      .catch(error => {
        throw error;
      });
    })
    // GET SESSION TOKEN
    .then(userInfo => {
      // SESSION IS EXPIRED, MUST RE-LOG
      if(Date.now() > userInfo.session_expiry){
        return login({username: userInfo.name, password: userInfo.password}).then(response => {
          return keytar.getPassword('Dietstory_Session', response.userInfo.name).then(sessionToken => {
            return {...response.userInfo, password: userInfo.password, session_token: sessionToken};
          });
        })
        .catch(error => {
          throw error;
        });
      }
      // SESSION IS STILL GOOD, RETRIEVE AND USE IT
      else{
        return keytar.getPassword('Dietstory_Session', userInfo.name).then(sessionToken => {
          if(sessionToken !== null){
            return {...userInfo, session_token: sessionToken};
          }
          else{
            throw new Error('Cannot find session token');
          }
        });
      }
    })
    // GET CSRF TOKEN
    .then(userInfo => {
      return keytar.getPassword('Dietstory_CSRF', userInfo.name).then(csrfToken => {
        if(csrfToken !== null){
          return {...userInfo, csrf_token: csrfToken};
        }
        else{
          throw new Error('Cannot find CSRF token');
        }
      });
    })
    .then(userInfo => {
      sessionKey = userInfo.session_token;      // GLOBAL VARIABLE
      sessionExpiry = userInfo.session_expiry;  // GLOBAL VARIABLE
      csrfToken = userInfo.csrf_token;          // GLOBAL VARIABLE

      resolve({
        body: {
          name: userInfo.name,
          email: userInfo.email,
          is_active: userInfo.is_active,
          is_superuser: userInfo.is_superuser
        },
        userInfo: userInfo
      });
    })
    .catch(error => {
      reject(error);
    })
  });
}

module.exports.login = login;
module.exports.autoLogin = autoLogin;