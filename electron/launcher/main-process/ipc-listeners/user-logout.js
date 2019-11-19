const request = require('request-promise');
const ipc = require('electron').ipcMain;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

/***
LOGOUT
======

LISTENS FOR http-logout EVENT FROM ipcRenderer (FROM REACT),
THEN POST TO DJANGO SERVER TO LOGOUT.

• cred <Object> {
  ◦ password <String>
  ◦ username <String>
}
***/

ipc.on('http-logout', (e, postData) => {
  let options = {
    method: 'POST',
    uri: djangoUrl +'/accounts/logout/',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    form: postData
  }

  request(options).then(response => {
    e.reply('http-logout-success', response);
  }).catch(error => {
    e.reply('http-logout-fail', error);
  });
});