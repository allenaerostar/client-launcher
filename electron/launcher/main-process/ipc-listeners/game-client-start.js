const checkForUpdateAndDownload = require('helpers/update-game-files').checkForUpdateAndDownload;
const exec = require('child_process').exec;
const ipc = require('electron').ipcMain;
const errorLogger = require('helpers/error-logger');


const startGameClient = () => {
  return new Promise((resolve, reject) => {
    const command = 'Dietstory.exe';
    exec(command, { cwd: gameInstallationPath }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(null);
    });
  });
}

ipc.on('start-game-client', event => {
  checkForUpdateAndDownload(event)
    .then(() => {
      event.reply('fm-up-to-date');
    })
    .then(() => {
      return startGameClient().catch(error => {
        throw error;
      })
    })
    .then(() => {
      event.reply('start-game-client-success');
    })
    .catch(error => {
      errorLogger('Unable to open game client.', error);
      event.reply('start-game-client-fail');
    });
});
