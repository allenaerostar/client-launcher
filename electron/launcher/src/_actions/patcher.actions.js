import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = (options) => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('fm-check-for-update');

    ipc.on('fm-up-to-date', () => {
      dispatch({type: patcherTypes.IS_LATEST_VERSION});

      if(options.initialCheck){
        dispatch({type: patcherTypes.INITIAL_CHECK_COMPLETE});
      }
      if(options.preGameLaunchCheck){
        dispatch({type: patcherTypes.QUEUE_GAME_LAUNCH});
      }
    });

    ipc.on('fm-download-start', () => {
      dispatch({type: patcherTypes.PATCHING})
    });

    ipc.on('fm-download-status-update', (e, update) => {
      dispatch({
        type: patcherTypes.DOWNLOAD_FILES_STATUS,
        payload: update
      });
    });

    // ipc.on('fm-check-for-update-error', (e, error) => {

    // });
  }
}

const resetGameLaunchQueue = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.RESET_GAME_LAUNCH_QUEUE});
  }
}

export const patcherActions = {
  checkForUpdate,
  resetGameLaunchQueue
};