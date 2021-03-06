const request = require('helpers/request-wrapper').request;
const _request = require('request');
const crypto = require('crypto');
const path = require('path');
const async = require('async');
const fs = require('fs-extra');
const qs = require('qs');
const errorLogger = require('helpers/error-logger');


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
calculateHashes = masterList => {
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

// REQUEST FOR S3 DOWNLOAD LINK OF A FILE
getDownloadUrls = files => {
  let query = qs.stringify({filenames: files}, {arrayFormat:'comma'});
  let options = {
    method: 'GET',
    uri: djangoUrl + `/game-files/download?${query}`,
    json: true
  }

  return new Promise((resolve, reject) => {
    if(files.length > 0){
      request(options).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    }
    else{
      resolve({});
    }
  });
}

// HEAD REQUEST TO AMAZON S3 TO GET THE SIZE OF THE FILE
getFileSize = url => {
  let options = {
    method: 'HEAD',
    uri: url,
    json: true
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(Number(response["content-length"]));
    }).catch(error => {
      reject(error);
    })
  });
}

// GET REQUEST TO DJANGO FOR LIST OF FILE HASHES
getHashList = version => {
  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/hashes',
    json: true
  }

  if(version !== 'latest'){
    options = {...options, qs: {version_id: version}};
  }

  return new Promise((resolve, reject) => {
    request(options).then(response => {
      resolve(response.hash_values);
    }).catch(error => {
      reject(error);
    });
  });
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
        let lastUpdateTime = 0;

        // START STREAMING DATA FROM S3
        let stream = _request({method: 'GET', uri: fileObject.downloadUrl});
        stream.pipe(ws);

        stream.on('error', error => {
          event.reply('fm-download-status-update', {
            status: 'error',
            currentFile: path.basename(fileObject.path),
            currentFileProgress: 0,
            currentFileSize: fileObject.size,
            totalProgress: totalDownloadedSize,
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

          if(Date.now() - lastUpdateTime > 1000){
            event.reply('fm-download-status-update', {
              status: 'downloading',
              currentFile: path.basename(fileObject.path),
              currentFileProgress: currentDownloadedSize,
              currentFileSize: fileObject.size,
              totalProgress: totalDownloadedSize + currentDownloadedSize,
              totalSize: totalSize,
              retryTime: 0,
              error: null
            });
            lastUpdateTime = Date.now();
          }
        });

        stream.on('end', () => {
          totalDownloadedSize += currentDownloadedSize;
          event.reply('fm-download-status-update', {
            status: 'file downloaded',
            currentFile: path.basename(fileObject.path),
            currentFileProgress: currentDownloadedSize,
            currentFileSize: fileObject.size,
            totalProgress: totalDownloadedSize,
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


const checkForUpdateAndDownload = (event) => {
  return new Promise((resolve, reject) => {
    let cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
    fileDifference = new Map();
  
    // MAKING GET REQUEST TO GET LATEST LIVE VERSION FILE HASHES
    getHashList('latest').then(list => {
      serverHashes = new Map(list);
    })
    // GET LOCAL FILE HASHES FROM CACHE FILE
    .then(() => {
      // TRY TO READ FROM hash_cache.json IN userData DIRECTORY
      return fs.readFile(cacheFilePath, 'utf-8').then(cacheFileData => {
        localHashes = new Map(JSON.parse(cacheFileData));
        return false;
      }, error => {
        if(error.code === 'ENOENT'){
          return true;
        }
        else{
          throw error;
        }
      });
    })
    // CHECKS THE RETURNED BOOLEAN FROM THE PREVIOUS .then(), IF TRUE THEN CALCULATES MD5 HASHES
    .then(requiredCalculation => {
      if(requiredCalculation){
        return calculateHashes(serverHashes).then(calculatedList => {
          localHashes = calculatedList;
          fs.writeFileSync(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
        }, () => {
          // DO NOTHING IF FAILED TO WRITE CACHE FILE
          errorLogger('Failed to write cache file.', {})
        });
      }
    })
    // COMPARE LOCAL HASHES WITH SERVER HASHES, FILENAME INTO ARRAY
    .then(() => {    
      return async.filter(serverHashes.keys(), (key, callback) => {
        if(!localHashes.has(key) || localHashes.get(key) !== serverHashes.get(key)){
          callback(null, true);
        }
        else{
          callback(null, false);
        }
      }).then(result => { return result; });
    })
    // MAKE REQUEST TO SERVER FOR S3 LINKS FOR EVERY FILES IN diff ARRAY
    .then(diff => {
      return getDownloadUrls(diff).then(response => {
        return Object.entries(response);
      }).catch(error => {
        throw error;
      });
    })
    // POPULATE fileDifference MAP TO BE USED BY FILE DOWNLOAD FUNCTION
    .then(links => {
      if(Object.keys(links).length > 0){
        let promises = []
  
        for(const [key, value] of links){
          promises.push(getFileSize(value.http_head_link));
        }
    
        return Promise.all(promises).then(sizesArray => {
          let index = 0;
          for(const [key, value] of links){
            let fileObject = {
              name: key,
              path: path.join(gameInstallationPath, key),
              tempPath: path.join(gameInstallationPath, 'tmp', path.basename(key)),
              hash: value.hash,
              downloadUrl: value.download_link,
              size: sizesArray[index]
            }
    
            fileDifference.set(key, fileObject);
            index++;
          }
        })
        .catch(error => {
          throw error;
        });
      }
    })
    // IPC RESPONSE TO REACT FRONT END OR DOWNLOAD IF UPDATE AVAILABLE
    .then(() => {
      if(fileDifference.size === 0){
        resolve(null);
      }
      else{
        let totalSize = 0;
        let downloadedHash;
  
        event.reply('fm-download-start');
  
        // CREATE A TEMP FOLDER TO HOLD THE NEW FILES
        return fs.mkdir(path.join(gameInstallationPath, 'tmp'))
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
          // CACHE THE LOCAL HASHMAP TO SAVE CALCULATION TIME IN THE FUTURE
          .then(() => {
            let cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
            fs.writeFileSync(cacheFilePath, JSON.stringify([...localHashes]), 'utf8');
          })
          .then(() => {
            return fs.remove(path.join(gameInstallationPath, 'tmp')).catch(error => {
              throw error;
            })
          })
          .then(() => {
            resolve(null);
          })
          .catch(error => {
            throw error;
          });
      }
    })
    .catch(error => {
      errorLogger('Failed to update game files.', error);
      reject(error)
    });
  });
}

const deleteCache = () => {
  return new Promise((resolve, reject) => {
    let cacheFilePath = path.join(app.getPath('userData'), 'hash_cache.json');
    fs.unlink(cacheFilePath, error => {
      if (error) {
        errorLogger("Unable to delete hash_cash.json.", error);
        throw error;
      }
      console.log("Successfully deleted hash_cache.json");
    });
  });
}

module.exports.checkForUpdateAndDownload = checkForUpdateAndDownload;
module.exports.deleteCache = deleteCache;