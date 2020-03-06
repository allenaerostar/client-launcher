const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const app = require('electron').app;
const errorLogger = require('helpers/error-logger');

// CHECKS WINDOWS DEFENDER'S EXCLUSION PATH
const checkWinDefender = () => {
  return new Promise((resolve, reject) => {
    let command = '$pref = Get-MpPreference; $pref.ExclusionPath';
    let options = {
      shell: 'powershell.exe', 
      windowsHide: true
    }

    exec(command, options, (error, stdout, stderr) => {
      if(error){
        reject(error);
      }
      resolve(stdout.includes(gameInstallationPath));
    });
  });
}

// ADDS GAME FOLDER INTO WINDOWS DEFENDER EXCLUSION PATH
const addExclusionPath = () => {
  return new Promise((resolve, reject) => {
    let command = `Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList 'Add-MpPreference -ExclusionPath "${gameInstallationPath}"'`;
    let options = {
      shell: 'powershell.exe', 
      windowsHide: true
    }

    exec(command, options, (error, stdout, stderr) => {
      if(error){
        reject(error);
      }
      resolve(0);
    });
  });
}

const load = () => {
  return new Promise((resolve, reject) => {

    // SETTING DIETSTORY GAME INSTALLATION PATH
    if(process.platform === 'win32'){
      // WINDOWS  ---  C:\Users\<Username>\AppData\Local\Dietstory\Game
      global.gameInstallationPath = path.join(app.getPath('appData'), '../Local', app.getName(), 'Game');
    }
    else{
      // MAC OS   ---  ~/Library/Application Support/Dietstory/Game
      // LINUX    ---  ~/.config/Dietstory/Game
      global.gameInstallationPath = path.join(app.getPath('userData'), 'Game');
    }

    // CREATING GLOBAL VARIABLE FOR SESSION
    global.sessionKey = '';
    global.sessionExpiry = 0;
    global.csrfToken = '';

    // INITIALIZING ERROR LOGGING 
    errorLogger.init();

    // MAKING SURE THE GAME FOLDER EXISTS
    fs.ensureDir(path.join(gameInstallationPath, '..')).then(() => {
      return fs.ensureDir(gameInstallationPath);
    })
    // CHECKING WINDOWS DEFENDER SETTINGS
    .then(() => {
      if(process.platform === 'win32'){
        return checkWinDefender();
      }
      else{
        return true;
      }
    })
    // ADDING EXCLUSION DIRECTORY TO WINDOWS DEFENDER, ELEVATION PROMPT
    .then(excluded => {
      if(!excluded){
        return addExclusionPath();
      }
      else{
        return null;
      }
    })
    .then(() => {
      resolve(0);
    })
    .catch(error => {
      reject(error);
    })
  })
}

module.exports.load = load;