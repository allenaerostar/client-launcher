const ipc = require('electron').ipcMain;
const fs = require('fs-extra');
const crypto = require('crypto');
const async = require('async');
const request = require('helpers/request-wrapper').request;
const FormData = require('form-data');
const errorLogger = require('helpers/error-logger');

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
    let lastUpdateTime = 0;

    // MAKING REQUEST TO DJANGO SERVER WITH THE FILE
    let form = new FormData();
    form.append('file_name', fileInfo.remotePath);
    form.append('file_hash', fileInfo.hash);
    form.append('file', fs.createReadStream(fileInfo.localPath), { knownLength: fileInfo.size });
    form.append('versionid', version);
    let formSize = form.getLengthSync();

    let options = {
      host: config.HOST.replace('http://', ''),
      port: config.PORT,
      path: '/game-files/upload',
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken, // GLOBAL VARIABLE
        'Cookie': `csrftoken=${csrfToken}; sessionid=${sessionKey}`, // GLOBAL VARIABLE
        'Content-Length': formSize
      }
    }

    form.submit(options, (error, response) => {
      if(error || response.statusCode >= 400){
        event.reply('upload-patch-files-status', {
          filename: fileInfo.name,
          local_path: fileInfo.localPath,
          size: formSize,
          uploadedSize: uploadedSize,
          message: 'Failed!'
        });
        failedList.push({error: error, name: fileInfo.name, local_path: fileInfo.localPath, remote_path: fileInfo.remotePath});
        setTimeout(() => {
          resolve(null);
        }, 2000);
      }
      else{
        event.reply('upload-patch-files-status', {
          filename: fileInfo.name,
          local_path: fileInfo.localPath,
          size: formSize,
          uploadedSize: uploadedSize,
          message: 'Done!'
        });
        successList.push({name: fileInfo.name, local_path: fileInfo.localPath, remote_path: fileInfo.remotePath});
        setTimeout(() => {
          resolve(null);
        }, 500);
      }
    });

    form.on('data', chunk => {
      uploadedSize += chunk.length; 
      
      if(Date.now() - lastUpdateTime > 250){
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        local_path: fileInfo.localPath,
        size: formSize,
        uploadedSize: uploadedSize,
        message: 'Uploading...'
      });
        lastUpdateTime = Date.now();
      }

      if(uploadedSize === formSize){
        event.reply('upload-patch-files-status', {
          filename: fileInfo.name,
          local_path: fileInfo.localPath,
          size: formSize,
          uploadedSize: uploadedSize,
          message: 'File Processing...'
        })
      }
    })
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
        reject(error);
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
    //console.log(result);
    event.reply('upload-patch-files-result', result);
  })
  .catch(error => {
    errorLogger('Unable to upload patch files.', error)
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
    errorLogger('Failed to fetch future patch versions', error);
    e.reply('get-future-versions-failed', error);
  })
});