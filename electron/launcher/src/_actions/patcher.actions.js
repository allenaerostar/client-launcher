import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = (reqInitialCheck) => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});

    ipc.send('fm-is-latest');

    ipc.on('fm-is-latest-fail', (e, error) => {
      dispatch({type: patcherTypes.UPDATE_CHECK_FAILED});
    });

    ipc.on('fm-is-latest-res', (e, res) => {
      if(res.isLatest){
        dispatch({
          type: patcherTypes.IS_LATEST_VERSION,
          payload: {
            reqInitialCheck: reqInitialCheck
          }
        });
      }
      else{
        dispatch({
          type: patcherTypes.UPDATE_AVAILABLE,
          payload: {
            reqInitialCheck: reqInitialCheck
          }
        });
      }
    });
  }
}

const downloadFiles = () => {
  return (dispatch) => {
    // START THE DOWNLOAD PROCESS
    dispatch({type: patcherTypes.DOWNLOAD_FILES_START});
    ipc.send('fm-download-difference');

    // STATUS UPDATES FROM ELECTRON
    ipc.on('fm-download-status-update', (e, update) => {
      dispatch({
        type: patcherTypes.DOWNLOAD_FILES_STATUS,
        payload: update
      });
    });

    // // ERROR FROM DOWNLOAD ATTEMPT
    // ipc.on('fm-download-difference-fail', (e, error) => {
    //   console.log(error);
    //   dispatch({type: patcherTypes.DOWNLOAD_FILES_FAIL});
    // });

    // DONWLOAD DONE
    ipc.on('fm-download-difference-fail', e => {
      dispatch({type: patcherTypes.DOWNLOAD_FILES_DONE});
    });
  }
}

export const patcherActions = {
  checkForUpdate,
  downloadFiles,
};