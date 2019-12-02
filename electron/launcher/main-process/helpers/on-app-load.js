const fs = require('fs').promises;
const path = require('path');

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
}

module.exports.load = load;