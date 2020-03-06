import * as types from '_constants/login_rewards.types';

const INITIAL_STATE = {
  rewards: [null, null, null, null, null],
  count: 0,
  error: null,
  collectionTime: 0
}

const ERROR_STATE = {
  rewards: [{image_path: 'assets/image-placeholder.png', item_name: 'Error', bottom_text: ''}, null, null, null, null],
  count: 1,
  error: null,
  collectionTime: 0
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.UPDATE_LOGIN_REWARDS:
      return { ...state, rewards: action.payload.rewards, count: action.payload.count };
    case types.LOGIN_REWARDS_ERROR:
      return { ...ERROR_STATE, error: action.payload};
    case types.CLEAR_ERROR:
      return INITIAL_STATE;
    case types.COLLECT_REWARD:
      return { ...state, collectionTime: action.payload};
    default:
      return state;
  }
}