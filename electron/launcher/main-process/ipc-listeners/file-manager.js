const request = require('request-promise');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const ipc = require('electron').ipcMain;
const app = require('electron').app;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;


var localHashes, serverHashes;
var fileDifference = [];


/***
================
HELPER FUNCTIONS
================
***/

// CALCULATES MD5 CHECKSUM OF FILE (SYNCHRONOUS)
checksum = fileStream => {
  return crypto.createHash('md5').update(fileStream).digest('hex');
}

// CALCULATES MD5 CHECKSUM FOR EVERY FILE IN `masterList` RETURNS MAP
calculateHashes = masterList =>{
  let calculatedList = new Map();
  let filesList = masterList.keys();
  let file = filesList.next();

  while(!file.done){
    let fileStream = fs.createReadStream(path.join(installationPath, file.value));
    fileStream.on('ready', () => {
      calculatedList.set(file.value, checksum(fileStream));
    });
    fileStream.on('error', error => {
      calculatedList.set(file.value, '');
    });

    file = filesList.next();
  }

  return calculatedList;
}

// GET LATEST LIST OF HASHES
async function getHashList(){ 
  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/hashes',
    json: true
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

// REQUEST FOR A SPECIFIC VERSION OF HASHES
async function getHashList(version){
  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/hashes',
    qs: {version_id: version},
    json: true
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}







/***
===============
EVENT LISTENERS
===============
***/

// CHECK IF USER'S DIETSTORY FILES ARE UP TO DATE
ipc.on('fm-is-latest', e => {



  // MAKING GET REQUEST TO GET LATEST FILE HASHES
  try{
    serverHashes = new Map(await getHashList());
  }catch (error){
    e.reply('fm-is-latest-fail', error);
  }

  // CHECK IF hash_cache.json IS PRESENT IN userData DIRECTORY
  const cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
  try{
    // FILE EXISTS => READS hash_cache.json AND USE IT AS LOCAL HASHES (NO NEED TO CALCULATE HASHES)
    let cacheFileData = await fs.readFile(cacheFilePath, 'utf-8');
    localHashes = new Map(JSON.parse(cacheFileData));
  }catch (error){
    // NO CACHE FILE => CALCULATE EVERY FILE'S HASH AND STORE IN FILE
    if(error.code === 'ENOENT'){ 
      localHashes = calculateHashes(serverHashes);
      await fs.writeFile(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
    }
    else{
      e.reply('fm-is-latest-fail', error);
    }
  }
  
  // COMPARING THE TWO MAPS
  for(let [name, hash] of serverHashes){
    if(localHashes.has(name)){ // GAME FILE PRESENT
      if(localHashes.get(name) !== hash){ // HASH DOES NOT MATCH
        fileDifference.push(name);
      }
    }
    else{ // GAME FILE IS MISSING
      fileDifference.push(name);
    }
  }

  if(fileDifference.length > 0){
    e.reply('fm-is-latest-res', {isLatest: false});
  }
  else{
    e.reply('fm-is-latest-res', {isLatest: true});
  }
});