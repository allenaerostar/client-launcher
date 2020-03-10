const fs = require('fs-extra');
const ipc = require('electron').ipcMain;
const path = require('path');
const request = require('helpers/request-wrapper').request;
const _request = require('request');
const errorLogger = require('helpers/error-logger');

const config = require('config.json').DJANGO_SERVER;
const djangoUrl = config.HOST +":" +config.PORT;

const ICON_URL_TEMPLATE = 'https://maplestory.io/api/GMS/83/item/{item_id}/iconRaw';

// GET CURRENT REWARD COUNTER FROM THE SERVER
const fetchLoginRewardIndex = () => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      uri: djangoUrl + '/login-bonus/rewards/myreward',
      json: true
    }

    request(options).then(response => {
      if(Object.entries(response).length === 0 && response.constructor === Object){ // TEST FOR EMPTY OBJECT
        resolve(0);
      }
      else{
        resolve(response.reward_num);
      }
    })
    .catch(error => {
      errorLogger('Failed to fetch list of daily login rewards.', error);
      reject(error);
    })
  });
}

// GET THE REWARD LIST FROM THE SERVER, RETURNS ONLY THE NEXT 5 REWARDS
const fetchLoginRewardsList = (index) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'GET',
      uri: djangoUrl + '/login-bonus/rewards',
      json: true
    }

    request(options).then(response => {
      let nextFiveRewards = [];

      for(var i = 0; i < 5; i++){
        if(index + i === response.length){
          let d = new Date();
          d.setMonth(d.getMonth() + 1, 1);
          let nextMonth = d.toLocaleString('en-US', { month: 'short' }).toUpperCase(); 

          nextFiveRewards.push({
            reward_num: -1,
            item_id: null,
            item_name: "That's All!",
            quantity: null,
            bottom_text: `Reset: ${nextMonth} 1st`
          })
        }
        else if (index + i > response.length){
          nextFiveRewards.push(null);
        }
        else{
          nextFiveRewards.push({
            ...response[index + i],
            bottom_text: `qty: ${response[index + i].quantity}`
          });
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

let getItemIcon = (iconDirectory, rewardObject) => {
  return new Promise((resolve, reject) => {
    if(rewardObject === null){
      resolve(null);
    }
    else if(rewardObject.item_id === 5999999){ // SPECIAL GACHA TICKET
      resolve('assets/special_gacha_ticket.png');
    }
    else if(rewardObject.reward_num === -1){ // MONTLY LOGIN REWARDS RESET
      resolve('assets/reward_reset.png');
    }
    else{
      let iconPath =  path.join(iconDirectory, `${rewardObject.item_id}.png`);

      fs.pathExists(iconPath).then(exists => {
        if(exists){
          resolve(iconPath);
        }
        else{
          let rs = _request(ICON_URL_TEMPLATE.replace('{item_id}', rewardObject.item_id)).on('error', error => {
            reject(error);
          })
          .pipe(fs.createWriteStream(iconPath));

          rs.on('finish', () => {
            resolve(iconPath);
          })
        }
      })
      .catch(error => {
        reject(error);
      });
    }
  });
}

const getItemImages = (rewards) => {
  const iconDirectory = path.join(gameInstallationPath, '..', 'Assets', 'Items');

  // CHECK TO SEE IF THE LOCAL ASSETS CACHE FOLDER EXISTS, CREATE IF NOT FOUND
  return fs.ensureDir(iconDirectory).then(() => {
    let promiseArray = [];
    
    for(reward of rewards){
      promiseArray.push(getItemIcon(iconDirectory, reward).catch(error => {
        return 'assets/image-placeholder.png'
      }));
    }

    return Promise.all(promiseArray).then(result => {
      return result;
    });
  });
}

const getLoginRewards = () => {
  return new Promise((resolve, reject) => {
    fetchLoginRewardIndex().then(index => {
      return fetchLoginRewardsList(index);
    })
    .then(rewards => {
      return getItemImages(rewards).then(result => {
        for(let i = 0; i < rewards.length; i++){
          if(rewards[i] !== null){
            rewards[i].image_path = result[i];
          }
        }
        return rewards;
      });
    })
    .then(rewards => {
      resolve(rewards);
    })
    .catch(error => {
      reject(error);
    })
  })
}

const claimLoginReward = () => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      uri: djangoUrl + '/login-bonus/rewards/collect'
    }

    request(options).then(response => {
      resolve(response);
    })
    .catch(error => {
      errorLogger('Failed to collect daily login reward', error)
      reject(error);
    });
  })
}






ipc.on('get-login-bonus', e => {
  getLoginRewards().then(rewards => {
    e.reply('get-login-bonus-success', rewards);
  })
  .catch(error => {
    e.reply('get-login-bonus-error', error);
  })
});

ipc.on('claim-login-bonus', e => {
  claimLoginReward().then(response => {
    e.reply('claim-login-bonus-success', response);
  })
  .catch(error => {
    e.reply('claim-login-bonus-error', error);
  })
})