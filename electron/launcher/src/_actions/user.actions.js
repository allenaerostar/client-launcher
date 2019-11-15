import history from '../_helpers/history';

const ipc = window.require('electron').ipcRenderer;

// Action creators for user handling
// API calls should go here?
const login = (username, password) => {
  //history.push('/');
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

const register = (user) => {
  console.log(user);
  return (dispatch) => {
    dispatch({type: 'REGISTER_START'});

    ipc.send('http-registration', user);

    ipc.on('http-registration-success', (e, res) => {
      dispatch({
        type: 'REGISTER_SUCCESS', 
        payload: {
          user: {
            username: user.username,
            password: user.password1,
            email: user.email,
            birthday: user.birthday,
            verified: false
          }
        }
      });

      history.push('/verify-email');
    });

    ipc.on('http-registration-fail', (e, err) => {
      dispatch({type: 'REGISTER_FAILED', payload: {error: err}});
    });
  }
}

const verifyEmail = (postData) => {
  return (dispatch) => {
    dispatch({type: 'VERIFY_EMAIL_START'});

    ipc.send('http-verify-email', postData);

    ipc.on('http-verify-email-success', (e, res) => {
      dispatch({type: 'VERIFY_EMAIL_SUCCESS'});
    });
    ipc.on('http-verify-email-fail', (e, err) => {
      dispatch({type: 'VERIFY_EMAIL_FAILED', payload: {error: err}});
    });
  }
}

export const userActions = {
  login,
  logout,
  register,
  verifyEmail
};