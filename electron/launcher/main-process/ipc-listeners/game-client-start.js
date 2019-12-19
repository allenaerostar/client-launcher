const fs = require('fs').promises;
const path = require('path');
const exec = require('child_process').exec;
const ipc = require('electron').ipcMain;
const app = require('electron').app;

const startGameClient = () => {
  return new Promise((resolve, reject) => {
    // exec('dietstory.exe', { cwd: gameInstallationPath }, (error, stdout, stderr) => {
    exec('open Resume.pdf', { cwd: '/Users/william/Downloads' }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
}

ipc.on('start-game-client', event => {
  
  // Look for game client folder
  // find dietstory exe, trigger it

  // const command = 'open dietstory.exe';
  startGameClient().then(() => {
    event.reply('start-game-client-success');
  }).catch((err) => {
    event.reply('start-game-client-fail')
  })  
});
