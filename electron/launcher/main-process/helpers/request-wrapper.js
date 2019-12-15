const rq = require('request-promise');
const autoLogin = require('login').autoLogin;

const config = require('config.json');
const djangoUrl = config.DJANGO_SERVER.HOST +":" +config.DJANGO_SERVER.PORT;


const checkSession = () => {
  return new Promise((resolve, reject) => {
    if(Date.now() > sessionExpiry){
      resolve(true);
    }
    else{
      resolve(false);
    }
  });
}


// THIS WRAPPERS INJECTS SENDS CSRF AND SESSION IN THE HEADER
const request = options => {
  return new Promise((resolve, reject) => {
    // CHECK SESSION
    checkSession().then(isFresh => {
      if(isFresh){
        return null;
      }
      else{
        return autoLogin().then(response => {
          return null;
        })
        .catch(error => {
          throw error;
        })
      }
    })
    // MODIFY REQUEST HEADER
    .then(() => {
      // ONLY ADD CSRF AND SESSION TOKEN TO REQUESTS TO DJANGO SERVER
      if(options.uri.contains(djangoUrl)){
        // ALREADY HAS A HEADER, WE WILL KEEP THE ORIGINAL AND ADDED CSRF AND SESSION INFO
        if(options.hasOwnProperty('header')){
          return {...options, header: {...options.header, 'X-CSRFToken': csrfToken, 'Cookie': `sessionid:${sessionKey}`}};
        }
        else{
          return {...options, header: {'X-CSRFToken': csrfToken, 'Cookie': `sessionid:${sessionKey}`}};
        }
      }
      else{
        return options;
      }
    })
    // MAKE REQUEST WITH MODIFIED OPTIONS
    .then(newOptions => {
      rq.request(newOptions).then(response => {
        resolve(response);
      })
      .catch(error => {
        throw error;
      })
    })
    .catch(error => {
      reject(error);
    })
  });
}

modules.export.request = request;
