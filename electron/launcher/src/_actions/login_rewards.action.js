import * as loginRewardTypes from '_constants/login_rewards.types';

const ipc = window.require('electron').ipcRenderer;

const getLoginRewards = () => {
  return (dispatch) => {
    dispatch({type: loginRewardTypes.FETCHING_LOGIN_REWARDS});
    ipc.send('get-login-bonus');
  }
}

const setLoginRewards = (rewards) => {
  let nonEmptyCount = 0;

  for(let i = 0; i < rewards.length; i++){
    if(rewards[i] !== null){
      nonEmptyCount++;
    }
  }

  return (dispatch) => {
    dispatch({
      type: loginRewardTypes.UPDATE_LOGIN_REWARDS,
      payload: {
        rewards: rewards,
        count: nonEmptyCount
      }
    });
  }
}

const loginRewardsError = (error) => {
  return (dispatch) => {
    dispatch({
      type: loginRewardTypes.LOGIN_REWARDS_ERROR,
      payload: error
    });
  }
}

const claimLoginReward = () => {
  return (dispatch) => {
    dispatch({
      type: loginRewardTypes.COLLECT_REWARD,
      payload: Date.now()
    });
    ipc.send('claim-login-bonus');
  }
}


export const loginRewardActions = {
  getLoginRewards,
  setLoginRewards,
  loginRewardsError,
  claimLoginReward
}