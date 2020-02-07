const fs = require('fs-extra');
const app = require('electron').app;
const path = require('path');
const isDev = require("electron-is-dev");

// TAKES DATES "YYYY-MM-DD" RETURNS TRUE IF IT IS OLDER THAN n
const olderThan = (date, n) => {
  let dateSplit = date.split('-').map(x => Number(x));
  let dateObject = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]); // - 1 BECAUSE OF MONTH INDEX

  if(dateObject.valueOf() < new Date().valueOf() - n){
    return true;
  }
  else{
    return false;
  }
}

// RUNS ONCE ON APPLICATION START
const init = () => {
  let logDir = path.join(app.getPath('userData'), 'logs');
  let thirtyDays = 2592000000; // ms

  // CHECK IF LOG DIRECTORY EXIST, MKDIR IF DNE
  fs.ensureDir(logDir).then(() => {
    // GET CONTENT OF LOG DIRECTORY
    return fs.readdir(logDir).then(content => {
      // FILTER NON DIRECTORIES AND FOLDERS LESS THAN 30 DAYS OLD
      return content.filter(entry => fs.statSync(path.join(logDir, entry)).isDirectory()).filter(entry => !olderThan(entry, thirtyDays));
    });
  })
  // DELETE LOG DIRECTORIES OLDER THAN 30 DAYS
  .then(deleteThese => {
    if(deleteThese.length === 0){
      return [];
    }
    else{
      let promises = [];

      for(dir of deleteThese){
        promises.push(new Promise ((resolve, reject) => {
          fs.remove(path.join(logDir, dir))
          .then(() => {
            resolve(null);
          })
          .catch(error => {
            reject(error);
          });
        }));
      }

      return Promise.all(promises);
    }
  })
  .catch(error => {
    // IF ERROR LOGGER FAILS THEN LOL
    if(isDev){
      console.log(error);
    }
  })
}

// SIMPLY PRINTS TO CONSOLE
const writeToConsole = (time, message, error) => {
  console.log(`\n[${time.date} ${time.hours}:${time.minutes}:${time.seconds} ${time.timezone}] ERROR: ${message}`);
  console.log(error);
}

// WRITES TO FILE IN PRODUCTION
const writeToFile = (time, message, error) => {
  let logDir = path.join(app.getPath('userData'), 'logs');

  // MAKE LOG FILE AND DIRECTORY IF IT DOES NOT EXIST
  fs.ensureFile(path.join(logDir, time.date, 'error_log')).then(() => {
    // MAKE stacktrace DIRECTORY IF IT DOES NOT EXIT
    return fs.ensureDir(path.join(logDir, time.date, 'stacktrace'));
  })
  // LOGS ERROR TO FILE
  .then(() => {
    let data = `[${time.date} ${time.hours}:${time.minutes}:${time.seconds} ${time.timezone}]\r\n`;
    data    += `\tMESSAGE: ${message}\r\n`
    data    += `\tTRACE FILE: ./stacktrace/${time.timestamp}\r\n`;

    return fs.appendFile(path.join(logDir, time.date, 'error_log'), data, 'utf8');
  })
  // LOGS THE STACK TRACE TO FILE
  .then(() => {
    return fs.writeFile(path.join(logDir, time.date, 'stacktrace', `${time.timestamp}`), (error.stack)?error.stack:JSON.stringify(error), 'utf8');
  })
  .catch(err => {
    console.log(err);
    // OH NOOOO, THAT SUCKS!!!
  })
}

// LOGS ERROR
const logError = (message, error) => {
  let now = new Date();
  let time = {
    timestamp: now.valueOf(),
    timezone: now.toString().match(/GMT-\d+/g)[0],
    date: `${now.getFullYear()}-${(now.getMonth()<10)?'0':''}${now.getMonth()}-${(now.getDate()<10)?'0':''}${now.getDate()}`,
    hours: `${(now.getHours()<10)?'0':''}${now.getHours()}`,
    minutes: `${(now.getMinutes()<10)?'0':''}${now.getMinutes()}`,
    seconds: `${(now.getSeconds()<10)?'0':''}${now.getSeconds()}`
  }

  if(isDev){
    writeToConsole(time, message, error);
  }
  else{
    writeToFile(time, message, error);
  }
}

module.exports = logError;
module.exports.init = init;