const request = require('request-promise');
const crypto = require('crypto');
const path = require('path');
const async = require('async');
const fs = require('fs-extra');
const ipc = require('electron').ipcMain;
const app = require('electron').app;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;


var localHashes, serverHashes, fileDifference;


/***
================
HELPER FUNCTIONS
================
***/

// CALCULATES MD5 CHECKSUM FOR EVERY FILE IN `masterList` RETURNS MAP
calculateHashes = masterList =>{
  return new Promise((resolve, reject) => {
    let calculatedList = new Map();
    let fileList = masterList.keys();

    async.eachSeries(fileList, (file, callback) => {
      let stream = fs.createReadStream(path.join(gameInstallationPath, file));
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
    }, error => {
      resolve(calculatedList);
    });
  });
}

// REQUEST FOR A SPECIFIC VERSION OF HASHES
// getHashList = version => {
//   let options = {
//     method: 'GET',
//     uri: djangoUrl + '/game-files/hashes',
//     json: true
//   }

//   if(version !== 'latest'){
//     options = {...options, qs: {version_id: version}};
//   }

//   return new Promise((resolve, reject) => {
//     request(options).then(response => {
//       resolve(response.hash_values);
//     }).catch(error => {
//       reject(error);
//     });
//   });
// }

// REQUEST FOR S3 DOWNLOAD LINK OF A FILE
// getDownloadUrl = (name, version) => {
//   let options = {
//     method: 'GET',
//     uri: djangoUrl + '/fill-this-in',
//     qs: {filename: name},
//     json: true
//   }

//   if(version !== 'latest'){
//     options = {...options, qs:{...qs, version_id: version}};
//   }

//   return new Promise((resolve, reject) => {
//     request(options).then(response => {
//       resolve(response.download_link)
//     }).catch(error => {
//       reject(error);
//     });
//   });
// }

// HEAD REQUEST TO AMAZON S3 TO MAKE GET THE SIZE OF THE FILE
getFileSize = downloadUrl => {
  let options = {
    method: 'HEAD',
    uri: downloadUrl
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(Number(response["content-length"]));
    }).catch(error => {
      reject(error);
    })
  });
}


getHashList = version => {
  return Promise.resolve([
    ["10kb.test", "1276481102f218c981e0324180bafd9f"],
    ["10mb.test", "f1c9645dbc14efddc7d8a322685f26eb"],
    ["150mb.test", "3d3be108b6b902c41404da7adff4a8da"],
    ["1kb.test", "0f343b0931126a20f133d67c2b018a3b"],
    ["500kb.test", "816df6f64deba63b029ca19d880ee10a"],
    ["50kb.test", "bf235f22df3e004ede21041978c24f2e"]
  ]);
}

getDownloadUrl = (name, version) => {
  switch (name){
    case '10kb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/10kb.test';
    case '10mb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/10mb.test';
    case '150mb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/150mb.test';
    case '1kb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/1kb.test';
    case '500kb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/500kb.test';
    case '50kb.test':
      return 'https://diestory-api-server-assets.s3.us-east-2.amazonaws.com/test_files/50kb.test';
    default:
      return '';
  }
}

// DOWNLOADS ALL FILES IN fileDifference TO tmp DIRECTORY, RETURNS A MAP OF THE NEW FILES HASHES
downloadFiles = (fileObjectList, totalSize, event) => {
  return new Promise((resolve, reject) => {
    let retryDelay = [5000, 10000, 20000, 40000, 60000];
    let retryDelayIndex = 0;
    let downloadedHash = new Map();
    let totalDownloadedSize = 0;

    // DOWNLOAD EACH FILE IN SERIES
    async.eachSeries(fileObjectList, (fileObject, eachSeriesCb) => {
      // MAKE 5 ATTEMPS TO DOWNLOAD THE FILE BEFORE THROWING ERROR
      async.retry({times: 5, interval: retryCount => {return retryDelay[retryCount]}}, retryCb => {
        let ws = fs.createWriteStream(fileObject.tempPath, 'binary');
        let hash = crypto.createHash('md5');
        let currentDownloadedSize = 0;

        // START STREAMING DATA FROM S3
        let stream = request({method: 'GET', uri: fileObject.downloadUrl});
        stream.pipe(ws);

        stream.on('error', error => {
          event.reply('fm-download-status-update', {
            status: 'error',
            currentFile: path.basename(fileObject.path),
            currentFileProgress: 0,
            currentFileSize: fileObject.size,
            totalFileProgress: totalDownloadedSize,
            totalSize: totalSize,
            retryTime: Date.now() + retryDelay[retryDelayIndex],
            error: error
          });
          retryDelayIndex++
          retryCb(error, null);
        });

        stream.on('data', chunk => {
          currentDownloadedSize += chunk.length;
          hash.update(chunk);
          event.reply('fm-download-status-update', {
            status: 'downloading',
            currentFile: path.basename(fileObject.path),
            currentFileProgress: currentDownloadedSize,
            currentFileSize: fileObject.size,
            totalFileProgress: totalDownloadedSize + currentDownloadedSize,
            totalSize: totalSize,
            retryTime: 0,
            error: null
          });
        });

        stream.on('end', () => {
          totalDownloadedSize += currentDownloadedSize;
          event.reply('fm-download-status-update', {
            status: 'download complete',
            currentFile: path.basename(fileObject.path),
            currentFileProgress: currentDownloadedSize,
            currentFileSize: fileObject.size,
            totalFileProgress: totalDownloadedSize,
            totalSize: totalSize,
            retryTime: 0,
            error: null
          });
          retryCb(null, hash.digest('hex'));
        });
      }, (error, result) => {
        if(error){
          eachSeriesCb(error);
        }
        else{
          downloadedHash.set(fileObject.name, result);
          eachSeriesCb();
        }
      });
    }, error => {
      if(error){
        reject(error);
      }
      else{
        resolve(downloadedHash);
      }
    });
  });
}




/***
===============
EVENT LISTENERS
===============
***/

// CHECK IF USER'S DIETSTORY FILES ARE UP TO DATE
ipc.on('fm-is-latest', async event => {
  fileDifference = new Map();

  // MAKING GET REQUEST TO GET LATEST FILE HASHES
  try{
    serverHashes = new Map(await getHashList('latest'));
  } catch (error){
    event.reply('fm-is-latest-fail', error);
  }

  // CHECK IF hash_cache.json IS PRESENT IN userData DIRECTORY
  let cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
  try{
    // hash_cache.json EXISTS => READS FILE AND USE IT AS LOCAL HASHES (NO NEED TO CALCULATE HASHES)
    localHashes = new Map(JSON.parse(await fs.readFile(cacheFilePath, 'utf-8')));
  } catch (error){
    // hash_cache.json D.N.E. => CALCULATES HASH FOR ALL FILES IN `serverHashes` AND WRITES TO CACHE FILE
    if(error.code === 'ENOENT'){
      localHashes = await calculateHashes(serverHashes);
      fs.writeFileSync(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
    }
    else{
      event.reply('fm-is-latest-fail', error);
    }
  }
  
  // COMPARING THE TWO MAPS
  if(serverHashes !== null && serverHashes.size > 0){
    for(let [filename, hash] of serverHashes){
      if(!localHashes.has(filename) || localHashes.get(filename) !== hash){
        try {
          let downloadUrl = await getDownloadUrl(filename, 'latest');
          let fileSize = await getFileSize(downloadUrl);
          let fileObject = {
            name: filename,
            path: path.join(gameInstallationPath, filename),
            tempPath: path.join(gameInstallationPath, 'tmp', path.basename(filename)),
            hash: hash,
            downloadUrl: downloadUrl,
            size: fileSize
          };
          fileDifference.set(filename, fileObject);
        } catch (error) {
          console.log(error);
        }
      }
    }

    // IF DIFFERENCE ARRAY IS NOT EMPTY => USER MUST UPDATE
    if(fileDifference.size > 0){
      event.reply('fm-is-latest-res', {isLatest: false});
    }
    else{
      event.reply('fm-is-latest-res', {isLatest: true});
    }
  }
});


// DOWNLOAD FILE FROM S3
ipc.on('fm-download-difference', event => {
  
  let totalSize = 0;
  let downloadedHash; 

  // CREATE A TEMP FOLDER TO HOLD THE NEW FILES
  fs.mkdir(path.join(gameInstallationPath, 'tmp'))
    // CALCULATES TOTAL SIZE OF THE DOWNLOAD
    .then(() => {
      fileDifference.forEach((fileObject, name, map) => {
        totalSize += fileObject.size;
      });
    })
    // DOWNLOADS FILE, CHECK INCOMING FILE'S HASH 
    .then(async function(){
      downloadedHash = await downloadFiles(fileDifference.values(), totalSize, event);
    })
    // COPY FILE FROM TEMP FOLDER TO GAME INSTALLATION FOLDER
    .then(() => {
      fileDifference.forEach(async function(fileObject, name, map){
        await fs.copyFile(fileObject.tempPath, fileObject.path);
      });
    })
    // UPDATE LOCAL HASHMAP
    .then(() => {
      downloadedHash.forEach((hash, name, map) => {
        localHashes.set(name, hash)
      });
    })
    // CACHE THE LOCAL HASHMAP TO SAVE CALCULATION TIME
    .then(() => {
      let cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
      fs.writeFileSync(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
    })
    .catch(error => {
      event.reply('fm-download-difference-fail', error);
    })
    // CLEANS UP TEMP FOLDER
    .finally(async function(){
      await fs.remove(path.join(gameInstallationPath, 'tmp'));
    });
});