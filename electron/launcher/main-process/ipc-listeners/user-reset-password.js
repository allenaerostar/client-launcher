const request = require('request-promise');
const authRequest = require('helpers/request-wrapper').request;
const ipc = require('electron').ipcMain;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST + ":" + config.PORT;

/***
RESET PASSWORD
============

LISTENS FOR http-password-reset EVENT FROM ipcRenderer (FROM REACT),
THEN SENDS AN HTTP POST REQUEST TO DJANGO WEBSERVER TO RESET PASSWORD.

@param {string} email
User's Email

}
***/
ipc.on('http-reset-password', (e, email) => {
  let options = {
    method: 'POST',
    uri: djangoUrl + '/accounts/password/reset/',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: email,
  }

  request(options).then(response => {
    e.reply('http-reset-password-success', response);
  }).catch(error => {
    e.reply('http-reset-password-fail', error);
  });
});

/***
CHANGE PASSWORD
============

LISTENS FOR http-password-change EVENT FROM ipcRenderer (FROM REACT),
THEN SENDS AN HTTP POST REQUEST TO DJANGO WEBSERVER TO CHANGE PASSWORD.

@param {object} cred
@param {string} cred.old_password
@param {string} cred.new_password1 - The new account password.
@param {string} cred.new_password2 - Verification of the new account password.
***/

ipc.on('http-change-password', (e, postData) => {
  let options = {
    method: 'POST',
    uri: djangoUrl + '/accounts/password/change/',
    form: postData,
    json: true
  }
// when i check with game-file/hashes, i am getting william, with change password i am not
  authRequest(options).then(response => {
    e.reply('http-change-password-success', response);
  }).catch(error => {
    e.reply('http-change-password-fail', error);
  });
});