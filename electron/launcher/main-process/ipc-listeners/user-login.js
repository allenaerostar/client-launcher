const request = require('request-promise');
const ipc = require('electron').ipcMain;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

/***
LOGIN (CREDENTIALS)
===================

LISTENS FOR http-login-credentials EVENT FROM ipcRenderer (FROM REACT),
THIS METHOD OF LOGGING IN USES USER'S INPUT (USERNAME & PASSWORD).

• cred <Object> {
  ◦ password <String>
  ◦ username <String>
}
***/

ipc.on('http-login-credentials', (e, cred) => {
  let options = {
    method: 'POST',
    uri: djangoUrl +'/accounts/login/',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    form: cred
  }

  request(options).then(response => {
    e.reply('http-login-credentials-success', JSON.parse(response));
  }).catch(error => {
    e.reply('http-login-credentials-fail', error);
  });
});