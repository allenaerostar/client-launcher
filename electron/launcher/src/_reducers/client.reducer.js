import * as types from '_constants/client.types';

const INITIAL_STATE = {
  isGameClientRunning: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.START_GAME_CLIENT_SUCCESS:
      return { ...state, isGameClientRunning: true };
    case types.START_GAME_CLIENT_FAIL:
      return { ...state, isGameClientRunning: false };
    default:
      return state;
  }
}