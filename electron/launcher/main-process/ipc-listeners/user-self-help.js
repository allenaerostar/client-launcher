const request = require('request-promise');
const ipc = require('electron').ipcMain;

const deleteCache = require('helpers/update-game-files').deleteCache;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

/***
SELF HELP
===================

LISTENS FOR http-self-help EVENT FROM ipcRenderer (FROM REACT),

***/

ipc.on('self-help-disconnect', (e, postData) => {
    console.log(postData);
    console.log("Disconnecting character with name: " + postData.character_name);
    let options = {
        method: 'POST',
        uri: djangoUrl + '/accounts/disconnect_character/',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: postData,
    }

    request(options).then(response => {
        e.reply('self-help-disconnect-success', response);
    }).catch(error => {
        e.reply('self-help-disconnect-fail', error);
    });
});

ipc.on('self-help-delete-cache', e => {
    console.log("Running function to delete local cache.");
    // Run function to delete locally cached data.
    deleteCache().then(() => {
        e.reply('self-help-delete-cache-success');
      }).catch(error => {
        e.reply('self-help-delete-cache-error', error);
    })
});