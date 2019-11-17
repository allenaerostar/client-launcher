const request = require('request-promise');

// POST REQUEST TO REGISTER USER
const registerUser = (user) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/signup/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: user,
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(JSON.parse(response));
    }).catch(err => {
        reject(err);
    });
  });
}

// POST REQUEST FOR VERIFYING EMAIL ADDRESS
const verifyAccount = (postData) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/verification/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: postData,
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(JSON.parse(response));
    }).catch(err => {
      reject(err);
    })
  });
}

// POST REQUEST TO LOGIN WITH USERNAME & PASSWORD
const loginCredentials = (cred) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/login/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: cred
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(JSON.parse(response));
    }).catch(err => {
      reject(err);
    });
  });
}

const logoutUser = (postData) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/logout/',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    form: postData
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(JSON.parse(response));
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports.logoutUser = logoutUser;
module.exports.registerUser = registerUser;
module.exports.verifyAccount = verifyAccount;
module.exports.loginCredentials = loginCredentials;
