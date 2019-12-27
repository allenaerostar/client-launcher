const checkForUpdateAndDownload = require('helpers/update-game-files').checkForUpdateAndDownload;
const ipc = require('electron').ipcMain;

/***
===============
EVENT LISTENERS
===============
***/

// CHECK IF USER'S DIETSTORY FILES ARE UP TO DATE
ipc.on('fm-check-for-update', event => {
  checkForUpdateAndDownload(event).then(() => {
    event.reply('fm-up-to-date');
  }).catch(error => {
    event.reply('fm-check-for-update-error', error);
  })
});