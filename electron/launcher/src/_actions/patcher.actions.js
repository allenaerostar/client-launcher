import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('fm-check-for-update');
  }
}

const startGameClient = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('start-game-client');
  }
}

const toggleIsLatestVersion = isInitialCheck => {
  return (dispatch) => {
    dispatch({type: patcherTypes.IS_LATEST_VERSION});

    if(isInitialCheck){
      dispatch({type: patcherTypes.INITIAL_CHECK_COMPLETE});
    }
  }
}

const setPatching = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.PATCHING});
  }
}

const setUpdateStatus = update => {
  return (dispatch) => {
    dispatch({
      type: patcherTypes.DOWNLOAD_FILES_STATUS,
      payload: update
    });
  }
}

const gameClientStarted = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.GAME_CLIENT_RUNNING});
  }
}

const gameClientExit = () => {
  return (dispatch) => {
    dispatch({type: patcherTypes.GAME_CLIENT_EXIT});
  }
}

export const patcherActions = {
  checkForUpdate,
  startGameClient,
  toggleIsLatestVersion,
  setPatching,
  setUpdateStatus,
  gameClientStarted,
  gameClientExit
};