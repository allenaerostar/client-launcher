const fs = require('fs-extra');
const ipc = require('electron').ipcMain;
const path = require('path');
const request = require('helpers/request-wrapper').request;
const errorLogger = require('helpers/error-logger');

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

// GET CURRENT REWARD COUNTER FROM THE SERVER
const fetchLoginRewardIndex = () => {
  return new Promise((resolve, reject) => {
    // let options = {
    //   method: 'GET',
    //   uri: djangoUrl + '/login-bonus/rewards',
    // }

    // request(options).then(response => {
    //   resolve(response);
    // })
    // .catch(error => {
    //   errorLogger('Failed to fetch list of daily login rewards.', error);
    //   reject(error);
    // })
    resolve(1);
  });
}

// GET THE REWARD LIST FROM THE SERVER, RETURNS ONLY THE NEXT 5 REWARDS
const fetchLoginRewardsList = (index) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      uri: djangoUrl + '/login-bonus/rewards',
    }

    request(options).then(response => {
      let nextFiveRewards = [];

      for(var i = -1; i < 4; i++){
        if(index + i === response.length){
          nextFiveRewards.push({
            reward_num: -1,
            item_id: null,
            item_name: "Monthly Refesh",
            quantity: null
          })
        }
        else if (index + i > response.length){
          nextFiveRewards.push(null);
        }
        else{
          nextFiveRewards.push(response[index + i]);
        }
      }

      return nextFiveRewards;
    })
    .then(rewards => {
      resolve(rewards);
    })
    .catch(error => {
      errorLogger('Failed to fetch list of daily login rewards.', error);
      reject(error);
    })
  });
}


const getItemImage = (rewards) => {
  const iconDirectory = path.join(gameInstallationPath, '..', 'Assets', 'Items');

  // CHECK TO SEE IF THE LOCAL ASSETS CACHE FOLDER EXISTS, CREATE IF NOT FOUND
  fs.ensureDir(iconDirectory).then(() => {
    let promises = [];

    for(reward of rewards){
      if(reward === null){
        reward.image_path = null;
      }
      else if(reward.item_id === 5999999){ // SPECIAL GACHA TICKET
        // SET IMAGE PATH HERE
      }
      else{
        let promise = new Promise((resolve, reject) => {
          let iconPath =  path.join(iconDirectory, `${reward.item_id}.png`);

          fs.pathExists(iconPath).then(exists => {
            if(exists){
              reward.image_path = iconPath;
              resolve(null);
            }
            else{
              let iconURL = `https://maplestory.io/api/GMS/83/item/${reward.item_id}/iconRaw`;
              let stream = request({method: 'GET', uri: iconURL})
              .on(error => {
                reject(error);
              })
              .pipe(fs.createWriteStream(path.join(iconDirectory, `${reward.item_id}`)));
              
              stream.on('finish', () => {
                reward.image_path = path.join(iconDirectory, `${reward.item_id}`);
                resolve(null);
              });

              promises.push(promise.catch(error => {
                // SET REWARD IMAGE TO GENERIC 'NO IMAGE' ICON
              }));
            }
          });
        });
      }
    }

    return Promise.all(promsies).then(() => {
      return rewards;
    });
  });
}

const getLoginRewards = () => {
  return new Promise((resolve, reject) => {
    fetchLoginRewardIndex().then(index => {
      return fetchLoginRewardsList(index);
    })
    .then(rewards => {
      return getItemImage(rewards);
    })
    .then(rewards => {
      resolve(rewards);
    })
    .catch(error => {
      reject(error);
    })
  })
}

/***

***/

ipc.on('get-login-bonus', e => {
  getLoginRewards().then(rewards => {
    e.reply('get-login-bonus-success', rewards);
  })
  .catch(error => {
    e.reply('get-login-bonus-error', error);
  })
});