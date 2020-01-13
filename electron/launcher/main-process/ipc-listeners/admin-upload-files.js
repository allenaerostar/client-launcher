const ipc = require('electron').ipcMain;
const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');
const request = require('helpers/request-wrapper').request;


/*
========================
HELPERS
========================
*/

// FUNCTION: CALCULATES MD5 HASHES, FIND FILE SIZES, AND FORMAT THE FILE PATHS
const generateFileInfoArray = (files) => {
  return new Promise((resolve, reject) => {
    let fileInfoArray = [];

    for(fileObject of files){
      let rs = fileObject.file.stream();
      let hash = crypto.createHash('md5');

      rs.on('data', chunk => {
        hash.update(chunk);
      });
      rs.on('error', () => {
        let error= new Error(`Error: MD5 hash calculation of ${filepath}`);
        reject(error);
      });
      rs.on('end', () => {
        let fileInfo = {
          name: fileObject.file.name,
          data: fileObject,
          hash: hash.digest('hex')
        }

        if(fileObject.path === '/'){
          fileObject.remotePath = fileObject.file.name
        }
        else{
          fileObject.remotePath = path.join(fileObject.path, fileObject.file.name);
        }

        fileInfoArray.push(fileInfo);
      });
    }
    resolve(fileInfoArray);
  });
};

// UPLOADS A FILE TO BACKEND WEB SERVER
const uploadFile = (fileInfo, version, event, successList, failedList) => {
  return new Promise((resolve, reject) => {

    const uploadedSize = 0;
    const rs = fileInfo.data.stream();

    let options = {
      method: 'POST',
      uri: djangoUrl + '?????????????',
      headers: { 'Content-Type': 'multipart/form-data' },
      formData: {
        file_name: fileInfo.remotePath,
        file_hash: fileIndo.hash,
        file: rs,
        versionid: version
      }
    }

    // STATUS UPDATES TO REACT FRONT END
    rs.on('data', chunk => {
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        size: fileInfo.data.size,
        uploadedSize: uploadedSize + chunk.size,
        message: 'uploading'
      });
    });
    rs.on('error', error => {
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        size: fileInfo.data.size,
        uploadedSize: uploadedSize,
        message: 'failed'
      });
    });
    rs.on('end', () => {
      event.reply('upload-patch-files-status', {
        filename: fileInfo.name,
        size: fileInfo.data.size,
        uploadedSize: uploadedSize,
        message: 'done'
      });
    });

    // MAKING REQUEST TO DJANGO SERVER WITH THE FILE
    request(options).then(() => {
      successList.push(fileInfo.name);
      resolve(null);
    }).catch(error => {
      failedList.push({error: error, filename: fileInfo.name});
      resolve(null);
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

// QUERY SERVER FOR LIST OF ACTIVE FUTURE PATCH VERSIONS AND CHECK IF VERSION IS UNIQUE
const isVersionUnique = version => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      uri: djangoUrl + '?????????????',
    }

    request(options).then(response => {
      for(futureVersion in response.futureVersions){
        if(futureVersion == version){
          resolve(false);
        }
      }
      resolve(true);
    }).catch(error => {
      let err = new Error('Error retrieving list of future versions.');
      reject(err);
    })
  })
}

// POST REQUEST TO BACKEND SERVER, CREATE A NEW FUTURE VERSION
const createNewFutureVersion = (version, date) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      uri: djangoUrl + '/game-files/version',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      form: {
        versionid: version,
        livebydate: date
      }
    }

    request(options).then(() => {
      resolve(null);
    }).catch(error => {
      let err = new Error('Error creating a new future patch version.');
      reject(err);
    })
  });
}







/*
STRUCTURE OF OBJECT FROM REACT:

  input = {
    version: 'v1.xxx',
    files: [
      {
        file: FILE-OBJECT,
        path: '/' 
      }
    ]
  }

*/

ipc.on('upload-patch-files', (event, input) => {
  // CHECK IF THE DESIRED VERSION IS A UNIQUE FUTURE VERSION
  isVersionUnique(input.version).then(isUnique => {
    if(isUnique){
      return createNewFutureVersion(input.version).catch(error => {
        throw error;
      });
    }
  })
  // BUILDING LIST TO BE UPLOADED
  .then(() => {
    return generateFileInfoArray(input.files, input.root);
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
