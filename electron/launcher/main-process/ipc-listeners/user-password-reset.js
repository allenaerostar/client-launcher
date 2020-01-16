const request = require('request-promise');
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
ipc.on('http-password-reset', (e, email) => {
  let options = {
    method: 'POST',
    uri: djangoUrl + '/accounts/password/reset',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: email,
  }

  request(options).then(response => {
    e.reply('http-password-reset-success', response);
  }).catch(error => {
    e.reply('http-password-reset-fail', error);
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

ipc.on('http-password-change', (e, cred) => {
  let options = {
    method: 'POST',
    uri: djangoUrl + '/accounts/password/change',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: cred,
  }

  request(options).then(response => {
    e.reply('http-password-change-success', response);
  }).catch(error => {
    e.reply('http-password-change-fail', error);
  });
});