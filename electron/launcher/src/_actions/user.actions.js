import history from '_helpers/history';
import * as actionTypes from '_constants/user.types';
import * as loadingTypes from '_constants/loading.types';

const ipc = window.require('electron').ipcRenderer;

// Action creators for user handling
// API calls should go here?
const login = (cred) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });

    ipc.send('http-login-credentials', cred);

    ipc.on('http-login-credentials-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          user: {
            username: res.username,
            email: res.email,
            isActive: res.is_active,
            isAdmin: res.is_superuser
          }
        }
      });

      if(res.is_active){
        history.push('/');
      }
      else{
        history.push('/verify-email');
      }
    });

    ipc.on('http-login-credentials-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.LOGIN_FAILED, payload: {error: err}});
    });
  }
}

const logout = (user) => {
  return (dispatch) => {
    ipc.send('http-logout', user);

    ipc.on('http-logout-success', (e, res) => {
      dispatch({type: actionTypes.LOGOUT_SUCCESS });

      history.push('/login');
    });

    ipc.on('http-logout-fail', (e, err) => {
      dispatch({ type: actionTypes.LOGOUT_FAILED, payload: { error: err } });
    });
  }
}

const resetPassword = (email) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-reset-password', email);

    ipc.on('http-reset-password-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS, payload: { message: res }  });
    });

    ipc.on('http-reset-password-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ type: actionTypes.RESET_PASSWORD_FAILED, payload: { error: err } });
    });
  }
}

const changePassword = (user) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-change-password', user);

    ipc.on('http-change-password-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ type: actionTypes.CHANGE_PASSWORD_SUCCESS, payload: { message: res } });
    });

    ipc.on('http-change-password-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ type: actionTypes.CHANGE_PASSWORD_FAILED, payload: { error: err } });
    });
  }
}

const register = (user) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    dispatch({type: actionTypes.REGISTER_START});

    ipc.send('http-registration', user);

    ipc.on('http-registration-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.REGISTER_SUCCESS, 
        payload: {
          user: {
            username: user.username,
            password: user.password1,
            email: user.email,
            birthday: user.birthday,
            isActive: false,
            isAdmin: false
          }
        }
      });

      history.push('/verify-email');
    });

    ipc.on('http-registration-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.REGISTER_FAILED, payload: {error: err}});
    });
  }
}

const verifyEmail = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    dispatch({type: actionTypes.VERIFY_EMAIL_START});

    ipc.send('http-verify-email', postData);

    ipc.on('http-verify-email-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.VERIFY_EMAIL_SUCCESS});
      history.push('/login');
    });
    ipc.on('http-verify-email-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.VERIFY_EMAIL_FAILED, payload: {error: err}});
    });
  }
}

const resendEmail = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-resend-verification-email', postData);

    ipc.on('http-resend-verification-email-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.RESEND_VERIFICATION_EMAIL_SUCCESS});
    });
    ipc.on('http-resend-verification-email-fail', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({type: actionTypes.RESEND_VERIFICATION_EMAIL_FAILED});
    });
  }
}

const resetError = (dispatch) => {
  return {
    type: actionTypes.RESET_ERROR
  }
}

const autoLogin = () => {
  return (dispatch) => {
    ipc.send('auto-login');

    ipc.on('auto-login-success', (e, res) => {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          user: {
            username: res.name,
            email: res.email,
            isActive: res.is_active,
            isAdmin: res.is_superuser
          }
        }
      });

      if(res.is_active){
        history.push('/');
      }
      else{
        history.push('/verify-email');
      }
    });

    ipc.on('auto-login-fail', (e, err) => {
      // DO NOTHING IF AUTO LOGIN FAILS?
    });
  }
}

export const userActions = {
  autoLogin,
  login,
  logout,
  register,
  verifyEmail,
  resendEmail,
  resetError,
  resetPassword,
  changePassword
};