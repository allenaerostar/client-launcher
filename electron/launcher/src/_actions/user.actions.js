import history from '_helpers/history';
import * as actionTypes from '_constants/user.types';
import * as loadingTypes from '_constants/loading.types';
import { prependOnceListener } from 'cluster';

const ipc = window.require('electron').ipcRenderer;

// Action creators for user handling
// API calls should go here?
const login = (cred) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-login-credentials', cred);
  }
}

const autoLogin = () => {
  return (dispatch) => {
    ipc.send('auto-login');
  }
}

const loginSuccess = (res) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
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
  }
}

const loginFailed = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({ 
      type: actionTypes.LOGIN_FAILED,
      payload: {
        message: `Failed to sign in.`,
        type: 'danger'
      }
    });
  }
}

const logout = (user) => {
  return (dispatch) => {
    ipc.send('http-logout', user);
  }
}

const logoutSuccess = () => {
  return (dispatch) => {
    dispatch({type: actionTypes.LOGOUT_SUCCESS });
    history.push('/login');
  }
}

const logoutFailed = (err) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.LOGOUT_FAILED, payload: { error: err } });
  }
}

const resetPassword = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-reset-password', postData);
  }
}

const resetPasswordSuccess = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.RESET_PASSWORD_SUCCESS,
      payload: { 
        message: `Check your email.` ,
        type: 'success'
      }  
    });
  }
}

const resetPasswordFailed = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({ 
      type: actionTypes.RESET_PASSWORD_FAILED, 
      payload: { 
        message: 'Failed to reset password.',
        type: 'danger'
      } 
    });
  }
}

const changePassword = (user) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-change-password', user);
  }
}

const changePasswordSuccess = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.CHANGE_PASSWORD_SUCCESS,
      payload: {
        message: 'Your password has been changed.',
        type: 'success'
      }
    });
  }
}

const changePasswordFailed = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({ 
      type: actionTypes.CHANGE_PASSWORD_FAILED,
      payload: {
        message: 'Failed to change password.',
        type: 'danger'
      }
    });
  }
}

const register = (user) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    dispatch({
      type: actionTypes.REGISTER_START,
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

    ipc.send('http-registration', user);
  }
}

const registerSuccess = (email) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.REGISTER_SUCCESS, 
      payload: {
        message: `A verification email has been sent to ${email}.`,
        type: 'success'
      }
    });

    history.push('/verify-email');
  }
}

const registerFailed = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({ 
      type: actionTypes.REGISTER_FAILED,
      payload: {
        message: `Failed to register`,
        type: 'danger'
      }
    });
  }
}

const verifyEmail = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    dispatch({type: actionTypes.VERIFY_EMAIL_START});

    ipc.send('http-verify-email', postData);
  }
}

const verifyEmailSuccess = () => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.VERIFY_EMAIL_SUCCESS,
      payload: {
        message: `You are now verified!`,
        type: 'success'
      }});
    history.push('/login');
  }
}

const verifyEmailFailed = (err) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({ 
      type: actionTypes.VERIFY_EMAIL_FAILED,
      payload: {
        message: err.detail,
        type: 'danger'
      }
    });
  }
}

const resendEmail = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-resend-verification-email', postData);
  }
}

const resendEmailSuccess = (email) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.RESEND_VERIFICATION_EMAIL_SUCCESS,
      payload: {
        message: `An email has been sent to ${email}`,
        type: 'success'
      }
    });
  }
}

const resendEmailFailed = (email) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_FINISH });
    dispatch({
      type: actionTypes.RESEND_VERIFICATION_EMAIL_FAILED,
      payload: {
        message: `Failed to send email to ${email}`,
        type: 'danger'
      }
    });
  }
}

const delete_cache = () => {
  return (dispatch) => {
    dispatch({type: actionTypes.DELETE_CACHE_START});
    ipc.send('self-help-delete-cache');
  }
}

const delete_cache_success = () => {
  return (dispatch) => {
    dispatch({type: actionTypes.DELETE_CACHE_SUCCESS});
    history.push('/');
  }
}

const delete_cache_failed = () => {
  return (dispatch) => {
    dispatch({type: actionTypes.DELETE_CACHE_FAILED});
  }
}

const disconnect = (postData) => {
  return (dispatch) => {
    dispatch({type: actionTypes.DISCONNECT_START});
    ipc.send('self-help-disconnect', postData);

    ipc.on('self-help-disconnect-success', (e, res) => {
      dispatch({type: actionTypes.DISCONNECT_SUCCESS});
      history.push('/');
    });

    ipc.on('auto-login-fail', (e, err) => {
      dispatch({type: actionTypes.DISCONNECT_FAILED});
    });
  }
}

export const userActions = {
  autoLogin,
  login,
  loginSuccess,
  loginFailed,
  logout,
  logoutSuccess,
  logoutFailed,
  register,
  registerSuccess,
  registerFailed,
  verifyEmail,
  verifyEmailSuccess,
  verifyEmailFailed,
  resendEmail,
  resendEmailSuccess,
  resendEmailFailed,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailed,
  changePassword,
  changePasswordSuccess,
  changePasswordFailed,
  delete_cache,
  delete_cache_success,
  delete_cache_failed,
  disconnect
};