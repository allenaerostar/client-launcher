import history from '_helpers/history';
import * as uploaderTypes from '_constants/uploader.types';

const ipc = window.require('electron').ipcRenderer;

const uploadFiles = input => {
  return (dispatch) => {
    dispatch({type: uploaderTypes.FILE_UPLOAD_START});

    ipc.send('upload-patch-files', input);
  }
}

const setFutureVersions = futureVerions => {
  return (dispatch) => {
    dispatch({
      type: uploaderTypes.SET_FUTURE_VERSIONS,
      payload: futureVerions
    })
  }
}

const setStatus = status => {
  return (dispatch) => {
    dispatch({
      type: uploaderTypes.SET_STATUS,
      payload: status
    });
  }
}

const setResult = result => {
  return (dispatch) => {
    dispatch({
      type: uploaderTypes.SET_RESULT,
      payload: result
    });
  }
}




export const uploaderActions = {
  uploadFiles,
  setFutureVersions,
  setStatus,
  setResult
};