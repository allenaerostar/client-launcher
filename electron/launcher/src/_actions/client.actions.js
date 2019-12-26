import * as clientTypes from '_constants/client.types';

const ipc = window.require('electron').ipcRenderer;

const startGameClient = () => {
  return (dispatch) => {
    ipc.send('start-game-client');

    ipc.on('start-game-client-success', (e, error) => {
      dispatch({ type: clientTypes.START_GAME_CLIENT_SUCCESS });
    });

    ipc.on('start-game-client-fail', (e, res) => {
      dispatch({ type: clientTypes.START_GAME_CLIENT_FAIL });
    });
  }
}

export const clientActions = {
  startGameClient
};