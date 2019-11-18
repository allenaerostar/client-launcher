const request = require('request-promise');
const ipc = require('electron').ipcMain;

const config = require('../config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

/***
REGISTRATION
============

LISTENS FOR http-registration EVENT FROM ipcRenderer (FROM REACT),
THEN SENDS AN HTTP POST REQUEST TO DJANGO WEBSERVER TO CREATE USER.

• user <Object> {
  ◦ birthday <String>
  ◦ email <String>
  ◦ password1 <String>
  ◦ password2 <String>
  ◦ username <String>
}
***/

ipc.on('http-registration', (e, user) => {
  let options = {
    method: 'POST',
    uri: djangoUrl +config.ROUTES.USER_SIGNUP,
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: user,
  }

  request(options).then(response => {
    e.reply('http-registration-success', response);
  }).catch(error => {
    e.reply('http-registration-fail', error);
  });
});



/***
VERIFYING ACCOUNT
=================

LISTENS FOR http-verify-email EVENT FROM ipcRenderer (FROM REACT),
THEN SENDS AN HTTP POST REQUEST TO DJANGO WEBSERVER TO CONFIRM USER'S EMAIL.

• postData <Object> {
  ◦ email <String>
  ◦ verify_token <String>
}
***/

ipc.on('http-verify-email', (e, postData) => {
  let options = {
    method: 'POST',
    uri: djangoUrl +config.ROUTES.USER_VERIFICATION,
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: postData,
  }

  request(options).then(response => {
    e.reply('http-verify-email-success', response);
  }).catch(error => {
    e.reply('http-verify-email-fail', error);
  });
});



/***
RESEND VERIFICATION EMAIL
=========================

LISTENS FOR http-resend-verification-email EVENT FROM ipcRenderer (FROM REACT),
THEN SENDS AN HTTP POST REQUEST TO DJANGO WEBSERVER TO RESEND CONFIRMATION EMAIL.

• email <Object> {
  ◦ email <String>
}
***/

// RESEND VERIFICATION EMAIL
ipc.on('http-resend-verification-email', (e, email) => {
  let options = {
    method: 'POST',
    uri: djangoUrl +config.ROUTES.USER_RESEND_VERIFICATION_CODE,
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: email,
  }

  request(options).then(response => {
    e.reply('http-resend-verification-email-success', response);
  }).catch(error => {
    e.reply('http-resend-verification-email-fail', error);
  });
});