const request = require('request-promise');
const crypto = require('crypto');
const path = require('path');
const async = require('async');
const fs = require('fs').promises;
const _fs = require('fs'); // REGULAR CALLBACK VERSION OF fs
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

// CALCULATES MD5 CHECKSUM FOR EVERY FILE IN `masterList` RETURNS MAP
calculateHashes = masterList =>{
  return new Promise((resolve, reject) => {
    let calculatedList = new Map();
    let filesList = masterList.keys();

    async.eachSeries(filesList, (file, callback) => {
      let stream = _fs.createReadStream(path.join(gameInstallationPath, file));
      let hash = crypto.createHash('md5');
      stream.on('data', chunk => {
        hash.update(chunk);
      });
      stream.on('error', error => {
        calculatedList.set(file, '');
        callback();
      });
      stream.on('end', () => {
        calculatedList.set(file, hash.digest('hex'));
        callback();
      });
    }, (error) => {
      resolve(calculatedList);
    });
  });
}

// REQUEST FOR A SPECIFIC VERSION OF HASHES
getHashList = version => {
  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/hashes',
    json: true
  }

  if(version === 'latest'){
    options = {...options, qs: {version_id: version}};
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/*
// FOR TESTING W/O DJANGO BACK END
getHashList = version => {
  let serverResponse = [
    ['amazing.wz', 'a9fa02b775551cc4bfc7737496db2ce6'],
    ['kappa.wz', '8b33a08c971005449a5d625651c840dd'],
    ['wow.wz', 'eb964c41b6e2615580f020d551545ae6']
  ];
  return Promise.resolve(serverResponse);
}
*/






/***
===============
EVENT LISTENERS
===============
***/

// CHECK IF USER'S DIETSTORY FILES ARE UP TO DATE
ipc.on('fm-is-latest', async event => {

  // MAKING GET REQUEST TO GET LATEST FILE HASHES
  try{
    serverHashes = new Map(await getHashList('latest'));
  } catch (error){
    event.reply('fm-is-latest-fail', error);
  }

  // CHECK IF hash_cache.json IS PRESENT IN userData DIRECTORY
  const cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
  try{
    // hash_cache.json EXISTS => READS FILE AND USE IT AS LOCAL HASHES (NO NEED TO CALCULATE HASHES)
    localHashes = new Map(JSON.parse(await fs.readFile(cacheFilePath, 'utf-8')));
  } catch (error){
    // hash_cache.json D.N.E. => CALCULATES HASH FOR ALL FILES IN `serverHashes` AND WRITES TO CACHE FILE
    if(error.code === 'ENOENT'){
      localHashes = await calculateHashes(serverHashes);
      _fs.writeFileSync(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
    }
    else{
      event.reply('fm-is-latest-fail', error);
    }
  }
  
  // COMPARING THE TWO MAPS
  for(let [filename, hash] of serverHashes){
    if(!localHashes.has(filename) || localHashes.get(filename) !== hash){
      fileDifference.push(filename);
    }
  }

  // IF DIFFERENCE ARRAY IS NOT EMPTY => USER MUST UPDATE
  if(fileDifference.length > 0){
    event.reply('fm-is-latest-res', {isLatest: false});
  }
  else{
    event.reply('fm-is-latest-res', {isLatest: true});
  }
});