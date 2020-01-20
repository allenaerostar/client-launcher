const ipc = require('electron').ipcMain;
const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');
const async = require('async');
const request = require('helpers/request-wrapper').request;

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;


/*
========================
HELPERS
========================
*/

// FUNCTION: CALCULATES MD5 HASHES, FIND FILE SIZES, AND FORMAT THE FILE PATHS
const generateFileInfoArray = (files) => {
  return new Promise((resolve, reject) => {
    let fileInfoArray = [];

    async.eachSeries(files, (fileObject, eachSeriesCb) => {
      let rs = fs.createReadStream(fileObject.file.local_path);
      let hash = crypto.createHash('md5');

      rs.on('data', chunk => {
        hash.update(chunk);
      });
      rs.on('error', () => {
        let error= new Error(`Error: MD5 hash calculation of ${fileObject.file.local_path}`);
        eachSeriesCb(error);
      });
      rs.on('end', () => {
        let stat = fs.statSync(fileObject.file.local_path);
        let size = stat['size'];

        let info = {
          name: fileObject.file.name,
          localPath: fileObject.file.local_path,
          remotePath: fileObject.remote_path,
          hash: hash.digest('hex'),
          size: size
        }

        fileInfoArray.push(info);
        eachSeriesCb();
      });

    }, error => {
      if(error){
        reject(error);
      }
      else{
        resolve(fileInfoArray);
      }
    });
  });
};

// UPLOADS A FILE TO BACKEND WEB SERVER
const uploadFile = (fileInfo, version, event, successList, failedList) => {
  return new Promise((resolve, reject) => {

    let uploadedSize = 0;
    let lastUpdateTime = 0

    let options = {
      method: 'POST',
      uri: djangoUrl + '/game-files/upload',
      headers: { 'Content-Type': 'multipart/form-data' },
      formData: {
        file_name: fileInfo.remotePath,
        file_hash: fileInfo.hash,
        file: fs.createReadStream(fileInfo.localPath).on('data', chunk => {
          uploadedSize += chunk.length;

          if(Date.now() - lastUpdateTime > 500){
            event.reply('upload-patch-files-status', {
              filename: fileInfo.name,
              local_path: fileInfo.localPath,
              size: fileInfo.size,
              uploadedSize: uploadedSize,
              message: 'uploading'
            });
            lastUpdateTime = Date.now();
          }

          console.log(uploadedSize);
        }),
        versionid: version
      }
    }

    // MAKING REQUEST TO DJANGO SERVER WITH THE FILE
    let req = request(options).then(() => {
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        local_path: fileInfo.localPath,
        size: fileInfo.size,
        uploadedSize: uploadedSize,
        message: 'done'
      });
      successList.push({name: fileInfo.name, path: fileInfo.local_path});
      setTimeout(() => {
        resolve(null);
      }, 500);
    }).catch(error => {
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        local_path: fileInfo.localPath,
        size: fileInfo.size,
        uploadedSize: uploadedSize,
        message: 'failed'
      });
      failedList.push({error: error, name: fileInfo.name, path: fileInfo.local_path});
      setTimeout(() => {
        resolve(null);
      }, 2000);
    });
  });
}

// UPLOAD ALL FILE IN THE ARRAY IN SEQUENTIAL ORDER
const sequentialUploadAll = (fileInfoArray, version, event) => {
  return new Promise((resolve, reject) => {
    let done = [];
    let failed = [];

    let result = fileInfoArray.reduce((promise, nextFile) => {
      return promise.then(() => {
        return uploadFile(nextFile, version, event, done, failed);
      });
    }, Promise.resolve());

    result.finally(() => {
      resolve({
        success: done,
        failed: failed
      })
    });
  });
}

// IF VERSION IS NEW -> POST REQUEST TO BACKEND SERVER, CREATE A NEW FUTURE VERSION
const createNewFutureVersion = (input) => {
  return new Promise((resolve, reject) => {
    if(input.newVersion){
      let options = {
        method: 'POST',
        uri: djangoUrl + '/game-files/version',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
          versionid: input.version,
          live_by: input.liveByDate.replace('T', ' ') +':00'
        }
      }
  
      request(options).then(() => {
        resolve(null);
      }).catch(error => {
        let err = new Error('Error creating a new future patch version.');
        reject(err);
      });
    }
    else{
      resolve(null);
    }
  });
}







/*
========================
IPC LISTENERS
========================



input: 
{
[1]   files: [
[1]     { file: {local_path, name}, remote_path: 'dietstory IP.txt' },
[1]     { file: [Object], remote_path: 'test.txt' }
[1]   ],
[1]   newVersion: false,
[1]   version: '1.6'
[1] }
*/

ipc.on('upload-patch-files', (event, input) => {
  // CHECK IF THE DESIRED VERSION IS A UNIQUE FUTURE VERSION
  createNewFutureVersion(input).then(() => {
    // BUILDING LIST TO BE UPLOADED
    return generateFileInfoArray(input.files);
  })
  // UPLOADS FILES ONE AT A TIME
  .then(fileInfoArray => {
    return sequentialUploadAll(fileInfoArray, input.version, event);
  })
  .then(result => {
    event.reply('upload-patch-files-result', result);
  })
  .catch(error => {
    console.log(error);
  }); 
});


ipc.on('get-future-versions', e  => {
  let options = {
    method: 'GET',
    uri: djangoUrl + '/game-files/future-versions',
    json: true
  }

  request(options).then(response => {
    e.reply('get-future-versions-response', response);
  }).catch(error => {
    e.reply('get-future-versions-failed', error);
  })
});