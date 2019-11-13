const request = require('request-promise');

// POST REQUEST TO REGISTER USER
registerUser = (user) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/signup/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: user,
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(err => {
        reject(err);
    });
  });
}

// POST REQUEST FOR VERIFYING EMAIL ADDRESS
verifyAccount = (postData) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/verification/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: postData,
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  });
}

// POST REQUEST TO LOGIN WITH USERNAME & PASSWORD
loginCredentials = (cred) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/signup/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: cred,
    resolveWithFullResponse: true
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(err => {
        reject(err);
    });
  });
}

// POST REQUEST FOR VERIFYING EMAIL ADDRESS
verifyAccount = (postData) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/verification/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: postData,
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  });
}

// POST REQUEST TO LOGIN WITH USERNAME & PASSWORD
loginCredentials = (cred) => {
  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/accounts/login/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: cred
  }

  return new Promise ((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports.registerUser = registerUser;
module.exports.verifyAccount = verifyAccount;
module.exports.loginCredentials = loginCredentials;
