import * as types from '_constants/patcher.types';

const INITIAL_STATE = {
  updateProgress: {
    message: '',
    currentFile: '',
    currentFileProgress: 0,
    totalProgress: 0,
    timeToRetry: 0,
    error: null
  },
  isLatest: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.IS_LATEST_VERSION:
      return { ...state, isLatest: true };
    case types.UPDATE_AVAILABLE:
      return { ...state, isLatest: false };
    default:
      return state;
  }
}