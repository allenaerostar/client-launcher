const ipc = require('electron').ipcMain;
const login = require('helpers/login');

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
  login.login(cred).then(response => {
    e.reply('http-login-credentials-success', response.body);
  })
  .catch(error => {
    e.reply('http-login-credentials-fail', error);
  });
});

ipc.on('auto-login', e => {
  login.autoLogin().then(response => {
    e.reply('auto-login-success', response);
  })
  .catch(error => {
    e.reply('auto-login-fail', error);
  })
});