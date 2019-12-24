import * as clientTypes from '_constants/client.types';
import * as patcherTypes from '_constants/patcher.types';

const ipc = window.require('electron').ipcRenderer;

const startGameClient = () => {
  return (dispatch) => {
    // ipc.send('fm-is-latest');

    // ipc.on('fm-is-latest-fail', (e, error) => {
    //   dispatch({type: patcherTypes.UPDATE_CHECK_FAILED});
    // });

    // ipc.on('fm-is-latest-res', (e, res) => {
    //   if(res.isLatest){
    //     dispatch({
    //       type: patcherTypes.IS_LATEST_VERSION,
    //       payload: {
    //         reqInitialCheck: false
    //       }
    //     });

    //     ipc.send('start-game-client');

    //     ipc.on('start-game-client-success', (e, error) => {
    //       dispatch({ type: clientTypes.START_GAME_CLIENT_SUCCESS });
    //     });
    
    //     ipc.on('start-game-client-fail', (e, res) => {
    //       dispatch({ type: clientTypes.START_GAME_CLIENT_FAIL });
    //     });
    //   }
    //   else{
    //     dispatch({
    //       type: patcherTypes.UPDATE_AVAILABLE,
    //       payload: {
    //         reqInitialCheck: false
    //       }
    //     });
    //   }
    // });
    console.log('kappa')
  }
}

export const clientActions = {
  startGameClient
};