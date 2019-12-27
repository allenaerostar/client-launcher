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
  patching: false,
  isGameClientRunning: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.CHECKING_FOR_UPDATE:
      return { ...state, playButtonLock: true };
    case types.INITIAL_CHECK_COMPLETE:
      return { ...state, reqInitialCheck: false };
    case types.IS_LATEST_VERSION:
      return { ...state, playButtonLock: false, patching: false };
    case types.PATCHING:
      return { ...state, patching: true };
    case types.DOWNLOAD_FILES_STATUS:
      return { ...state, updateProgress: action.payload };
    case types.GAME_CLIENT_RUNNING:
      return { ...state, isGameClientRunning: true };
    case types.GAME_CLIENT_EXIT:
      return { ...state, isGameClientRunning: false };
    default:
      return state;
  }
}