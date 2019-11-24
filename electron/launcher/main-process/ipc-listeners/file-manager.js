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

checksum = dataStream => {
  return crypto.createHash('md5').update(dataStream).digest('hex');
}

// CHECK IF USER'S DIETSTORY FILES ARE UP TO DATE
ipc.on('fm-is-latest', e => {

  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/hashes',
    qs: {version_id: 'latest'},
    json: true
  }

  // MAKING GET REQUEST TO GET LATEST FILE HASHES
  try{
    serverHashes = new Map(await request(options));
  }catch (error){
    e.reply('fm-is-latest-fail', error);
  }

  // CHECK IF hash_cache.json IS PRESENT IN userData DIRECTORY
  const cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
  try{
    localHashes = new Map(await fs.readFile(cacheFilePath, 'utf-8'));
  }catch (error){
    if(error.code === 'ENOENT'){ 
      localHashes = new Map(); 
    }
    else{
      e.reply('fm-is-latest-fail', error);
    }
  }
  
  // COMPARING THE TWO MAPS
  for(let [name, hash] of serverHashes){
    if(localHashes.has(name)){ // FILE PRESENT
      if(localHashes.get(name) !== hash){ // HASH DOES NOT MATCH
        fileDifference.push(name);
      }
    }
    else{ // FILE IS MISSING
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