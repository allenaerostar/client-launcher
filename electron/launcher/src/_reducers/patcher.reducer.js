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
  isLatest: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.IS_LATEST_VERSION:
      return { ...state, isLatest: true };
    case types.UPDATE_AVAILABLE:
      return { ...state, isLatest: false };
    case types.DOWNLOAD_FILES_STATUS:
      return { ... state, updateProgress: action.payload}
    default:
      return state;
  }
}