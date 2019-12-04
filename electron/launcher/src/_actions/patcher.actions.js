import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});

    ipc.send('fm-is-latest');

    ipc.on('fm-is-latest-fail', (e, error) => {
      dispatch({type: patcherTypes.UPDATE_CHECK_FAILED});
    });

    ipc.on('fm-is-latest-res', (e, res) => {
      if(res.isLatest){
        dispatch({type: patcherTypes.IS_LATEST_VERSION});
      }
      else{
        dispatch({type: patcherTypes.UPDATE_AVAILABLE});
      }
    });
  }
}

const downloadFiles = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.DOWNLOAD_FILES_START});

    ipc.send('fm-download-difference');
  }
}

export const patcherActions = {
  checkForUpdate,
  downloadFiles
};