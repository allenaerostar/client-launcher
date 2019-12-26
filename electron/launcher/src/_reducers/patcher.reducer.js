import * as types from '_constants/patcher.types';

const INITIAL_STATE = {
  updateProgress: {
    status: '',
    currentFile: '',
    currentFileProgress: 0,
    currentFileSize: 0,
    totalProgress: 0,
    totalSize: 0,
    retryTime: 0,
    error: null
  },
  playButtonLock: false,
  reqInitialCheck: true,
  gameLaunchQueued: false,
  patching: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.CHECKING_FOR_UPDATE:
      return { ...state, playButtonLock: true}
    case types.INITIAL_CHECK_COMPLETE:
      return { ...state, reqInitialCheck: false}
    case types.QUEUE_GAME_LAUNCH:
      return { ...state, gameLaunchQueued: true}
    case types.IS_LATEST_VERSION:
      return { ...state, playButtonLock: false, patching: false};
    case types.PATCHING:
      return { ...state, patching: true };
    case types.DOWNLOAD_FILES_STATUS:
      return { ...state, updateProgress: action.payload};
    case types.RESET_GAME_LAUNCH_QUEUE:
      return { ...state, gameLaunchQueued: false};
    default:
      return state;
  }
}