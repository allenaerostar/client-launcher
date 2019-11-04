const electron = require('electron');
const request = require('request-promise');

registerUser = (user) => {

  let options = {
    method: 'POST',
    uri: 'http://127.0.0.1:8000/signup/',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: user,
    resolveWithFullResponse: true
  }

  return new Promise ((resolve, reject) => {
    request(options).then((response) => {
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
  });
}

module.exports.registerUser = registerUser;