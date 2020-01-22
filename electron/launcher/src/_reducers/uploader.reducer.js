import * as types from '_constants/uploader.types';

const INITIAL_STATE = {
  futureVersions: [],
  status: {
    filename: '',
    local_path: '',
    size: 0,
    uploadedSize: 0,
    message: ''
  },
  isUploading: false,
  uploadResults: {
    failed: [],
    success: []
  }
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.FILE_UPLOAD_START:
      return { ...state, isUploading: true };
    case types.SET_FUTURE_VERSIONS:
      return { ...state, futureVersions: action.payload };
    case types.SET_STATUS:
      return { ...state, status: action.payload};
    case types.SET_RESULT:
      return { ...state, uploadResults: action.payload, isUploading: false };
    case types.RESET_STATE:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}