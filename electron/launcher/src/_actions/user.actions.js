import history from '../_helpers/history';

const ipc = window.require('electron').ipcRenderer;

// Action creators for user handling
// API calls should go here?
const login = (username, password) => {
   return {
     type: 'LOGIN',
     payload: {
       username: username,
       password: password
     }
   };
   
}
const logout = () => {
  return {
    type: 'LOGOUT',
  }
}
// const register = (user) => async (dispatch, getState) => {
//   dispatch({
//     type: 'REGISTER',
//     payload: user
//   });

//   history.push('/login');
// }

const register = (user) => {
  return (dispatch) => {
    dispatch({type: 'REGISTER_START'});

    ipc.send('http-registration', user);

    ipc.on('http-registration-success', (e, res) => {
      dispatch({type: 'REGISTER_SUCCESS'});
    });

    ipc.on('http-registration-fail', (e, err) => {
      dispatch({type: 'REGISTER_FAILED'});
    });
  }
}

export const userActions = {
  login,
  logout,
  register
};