import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = (isInitialCheck) => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('fm-check-for-update');

    ipc.on('fm-up-to-date', () => {
      dispatch({type: patcherTypes.IS_LATEST_VERSION});

      if(isInitialCheck){
        dispatch({type: patcherTypes.INITIAL_CHECK_COMPLETE});
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

const startGameClient = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('start-game-client');

    ipc.on('fm-up-to-date', () => {
      dispatch({type: patcherTypes.IS_LATEST_VERSION});
      dispatch({type: patcherTypes.GAME_CLIENT_RUNNING});
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

    ipc.on('start-game-client-success', () => {
      dispatch({type: patcherTypes.GAME_CLIENT_EXIT});
    });

    ipc.on('start-game-client-fail', () => {
      dispatch({type: patcherTypes.GAME_CLIENT_EXIT});
    });
  }
}

export const patcherActions = {
  checkForUpdate,
  startGameClient
};