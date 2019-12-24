import * as patcherTypes from '_constants/patcher.types';
import * as clientTypes from '_constants/client.types';

const ipc = window.require('electron').ipcRenderer;

const checkForUpdate = (options) => {
  return (dispatch) => {
    dispatch({type: patcherTypes.CHECKING_FOR_UPDATE});
    ipc.send('fm-is-latest');

    ipc.on('fm-is-latest-fail', (e, error) => {
      dispatch({type: patcherTypes.UPDATE_CHECK_FAILED});
    });

    ipc.on('fm-is-latest-res', (e, res) => {
      // GAME VERSION UP TO DATE
      if(res.isLatest){
        dispatch({
          type: patcherTypes.IS_LATEST_VERSION,
          payload: {
            reqInitialCheck: options.reqInitialCheck,
            reqGameLaunchCheck: options.reqGameLaunchCheck
          }
        });
        if(!options.reqGameLaunchCheck){
          ipc.send('start-game-client');

          ipc.on('start-game-client-success', (e, error) => {
            dispatch({ type: clientTypes.START_GAME_CLIENT_SUCCESS });
          });
      
          ipc.on('start-game-client-fail', (e, res) => {
            dispatch({ type: clientTypes.START_GAME_CLIENT_FAIL });
          });
        }
      }
      // VERSION OUTDATED, DOWNLOAD FILE DIFFERENCES
      else{
        dispatch({
          type: patcherTypes.UPDATE_AVAILABLE,
          payload: {
            reqInitialCheck: options.reqInitialCheck,
            reqGameLaunchCheck: options.reqGameLaunchCheck
          }
        });

        ipc.send('fm-download-difference');

        ipc.on('fm-download-status-update', (e, update) => {
          dispatch({
            type: patcherTypes.DOWNLOAD_FILES_STATUS,
            payload: update
          });
        });

        ipc.on('fm-download-difference-done', () => {
          dispatch({type: patcherTypes.DOWNLOAD_FILES_DONE});

          if(!options.reqGameLaunchCheck){
            
            ipc.send('start-game-client');

            ipc.on('start-game-client-success', (e, error) => {
              dispatch({ type: clientTypes.START_GAME_CLIENT_SUCCESS });
            });
        
            ipc.on('start-game-client-fail', (e, res) => {
              dispatch({ type: clientTypes.START_GAME_CLIENT_FAIL });
            });
          }
        })
      }
    });
  }
}

export const patcherActions = {
  checkForUpdate
};