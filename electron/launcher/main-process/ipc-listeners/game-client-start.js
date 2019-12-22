const exec = require('child_process').exec;
const ipc = require('electron').ipcMain;


const startGameClient = () => {
  return new Promise((resolve, reject) => {
    const command = 'open dietstory.exe';
    exec(command, { cwd: gameInstallationPath }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
}

ipc.on('start-game-client', event => {
  
  startGameClient().then(() => {
    event.reply('start-game-client-success');
  }).catch((err) => {
    event.reply('start-game-client-fail')
  })  
});
