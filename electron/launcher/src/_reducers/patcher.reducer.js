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
  isLatest: false,
  reqInitialCheck: true,
  reqGameLaunchCheck: true,
  patching: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.CHECKING_FOR_UPDATE:
      return { ...state, patching: true}
    case types.IS_LATEST_VERSION:
      return { ...state, isLatest: true, reqInitialCheck: action.payload.reqInitialCheck, reqGameLaunchCheck: action.payload.reqGameLaunchCheck, patching: false };
    case types.UPDATE_AVAILABLE:
      return { ...state, isLatest: false, reqInitialCheck: action.payload.reqInitialCheck, reqGameLaunchCheck: action.payload.reqGameLaunchCheck, patching: true };
    case types.DOWNLOAD_FILES_STATUS:
      return { ...state, updateProgress: action.payload, patching: true};
    case types.DOWNLOAD_FILES_DONE:
      return { ...state, isLatest: true, patching: false}
    default:
      return state;
  }
}