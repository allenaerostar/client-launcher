const keytar = require('keytar');
const fs = require('fs-extra');
const electron = require('electron');
const path = require('path');
const request = require('helpers/request-wrapper').request;
const ipc = electron.ipcMain;
const app = electron.app;

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
  };

  // MAKE REQUEST TO SERVER FOR LOG OUT
  request(options).then(response => {
    return response;
  })
  //REMOVES USER INFO FILE
  .then(response => {
    return fs.unlink(path.join(app.getPath('userData'), 'user_info')).then(() => {
      return response;
    })
    .catch(error => {
      throw error;
    });
  })
  // FIND USERNAME
  .then(response => {
    return keytar.findCredentials('Dietstory').then(credentialArray => {
      if(credentialArray.length > 0){
        return {username: credentialArray[0].account, server_response: response};
      }
      else{
        throw new Error('Can\'t find username');
      }
    })
    .catch(error => {
      throw error;
    })
  })
  // REMOVE CSRF, SESSION, USERNAME AND PASSWORD FROM SECURE VAULT
  .then(response => {
    let promises = [
      keytar.deletePassword('Dietstory', response.username),
      keytar.deletePassword('Dietstory_Session', response.username),
      keytar.deletePassword('Dietstory_CSRF', response.username)
    ];

    sessionKey = '';
    sessionExpiry = 0;
    csrfToken = '';

    return Promise.all(promises).then(result => {
      return response.server_response;
    });
  })
  .catch(error => {
    // DO NOTHING ON ERROR
  })
  .finally(response => {
    e.reply('http-logout-success', response);
  })
});