const fs = require('fs').promises;
const path = require('path');
const exec = require('child_process').exec;

// CHECKS WINDOWS DEFENDER'S EXCLUSION PATH
async function checkWinDefender(){
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
async function addExclusionPath(){
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

async function load(){
  // MAKE `Dietstory` DIRECTORY IF IT DOES NOT EXIST
  try{
    await fs.stat(path.join(gameInstallationPath, '..'));
  } catch(error){
    if(error.code === 'ENOENT'){
      await fs.mkdir(error.path);
    }
  }

  // MAKE `Game` DIRECTORY IN THE DIRECTORY ABOVE IF IT DOES NOT EXIST
  try{
    await fs.stat(gameInstallationPath);
  } catch(error){
    if(error.code === 'ENOENT'){
      await fs.mkdir(error.path);
    }
  }

  // ADDS GAME INSTALLTION FOLDER TO WINDOWS DEFENDER EXLUSION LIST IF NOT ALREADY THERE
  if(process.platform === 'win32'){
    try{
      let excluded = await checkWinDefender();
      if(!excluded){
        await addExclusionPath();
      }
    } catch(error){
      console.log(error);
    }
  }
}

module.exports.load = load;