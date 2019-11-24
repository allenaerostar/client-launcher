const app = require('electron').app;
const fs = require('fs').promises;

async function load(){
  
  // SUPPORTS WINDOW ONLY
  if (process.platform === 'win32'){

    // CREATE GAME INSTALLATION FOLDER IN %APPDATA%/Local IF IT DOES NOT EXIST
    try {
      await fs.stat(installationPath);
    }catch (error) {
      if(error.code === 'ENOENT'){ await fs.mkdir(installationPath); }
    }

  }
}

module.exports.load = load;