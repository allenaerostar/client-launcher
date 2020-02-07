const rq = require('request-promise');
const autoLogin = require('helpers/login').autoLogin;
const errorLogger = require('helpers/error-logger');

const config = require('config.json');
const djangoUrl = config.DJANGO_SERVER.HOST +":" +config.DJANGO_SERVER.PORT;


const checkSession = () => {
  return new Promise((resolve, reject) => {
    if(Date.now() > sessionExpiry){
      autoLogin().then(response => {
        resolve(null);
      })
      .catch(error => {
        errorLogger('Failed to check session token.', error);
        reject(error);
      })
    }
    else{
      resolve(null);
    }
  });
}


// THIS WRAPPERS INJECTS SENDS CSRF AND SESSION IN THE HEADER
const request = options => {
  return new Promise((resolve, reject) => {
    // CHECK SESSION IF EXPIRED THEN AUTO LOGIN
    checkSession().then(() => {
      // ONLY ADD CSRF AND SESSION TOKEN TO REQUESTS TO DJANGO SERVER
      if(options.uri.includes(djangoUrl)){
        // ALREADY HAS A HEADER, WE WILL KEEP THE ORIGINAL AND ADDED CSRF AND SESSION INFO
        if(options.hasOwnProperty('headers')){
          return { ...options, headers: { ...options.headers, 'X-CSRFToken': csrfToken, Cookie: `csrftoken=${csrfToken}; sessionid=${sessionKey}`}};
        }
        else{
          return { ...options, headers: { 'X-CSRFToken': csrfToken, Cookie: `csrftoken=${csrfToken}; sessionid=${sessionKey}`}};
        }
      }
      else{
        return options;
      }
    })
    // MAKE REQUEST WITH MODIFIED OPTIONS
    .then(newOptions => {
      return rq(newOptions).then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
    })
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      errorLogger('Error while injecting headers.', error);
      reject(error);
    })
  });
}

module.exports.request = request;
