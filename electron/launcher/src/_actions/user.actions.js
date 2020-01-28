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
      dispatch({ 
        type: actionTypes.LOGIN_FAILED,
        payload: {
          message: `Failed to sign in.`,
          type: 'danger'
        }
      });
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

const resetPassword = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-reset-password', postData);

    ipc.on('http-reset-password-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.RESET_PASSWORD_SUCCESS,
        payload: { 
          message: `A new password has been sent to ${postData.email}.` ,
          type: 'success'
        }  
      });
    });

    ipc.on('http-reset-password-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ 
        type: actionTypes.RESET_PASSWORD_FAILED, 
        payload: { 
          message: 'Failed to reset password.',
          type: 'danger'
        } 
      });
    });
  }
}

const changePassword = (user) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-change-password', user);

    ipc.on('http-change-password-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        payload: {
          message: 'Your password has been changed.',
          type: 'success'
        }
      });
    });

    ipc.on('http-change-password-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ 
        type: actionTypes.CHANGE_PASSWORD_FAILED,
        payload: {
          message: 'Failed to change password.',
          type: 'danger'
        }
      });
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
          },
          message: `A verification email has been sent to ${user.email}.`,
          type: 'success'
        }
      });

      history.push('/verify-email');
    });

    ipc.on('http-registration-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ 
        type: actionTypes.REGISTER_FAILED,
        payload: {
          message: `Failed to register`,
          type: 'danger'
        }
      });
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
      dispatch({
        type: actionTypes.VERIFY_EMAIL_SUCCESS,
        payload: {
          message: `You are now verified!`,
          type: 'success'
        }});
      history.push('/login');
    });
    ipc.on('http-verify-email-fail', (e, err) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({ 
        type: actionTypes.VERIFY_EMAIL_FAILED,
        payload: {
          message: err.detail,
          type: 'danger'
        }
      });
    });
  }
}

const resendEmail = (postData) => {
  return (dispatch) => {
    dispatch({ type: loadingTypes.FETCHING_START });
    ipc.send('http-resend-verification-email', postData);

    ipc.on('http-resend-verification-email-success', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.RESEND_VERIFICATION_EMAIL_SUCCESS,
        payload: {
          message: `An email has been sent to ${postData.email}`,
          type: 'success'
        }
      });
    });
    ipc.on('http-resend-verification-email-fail', (e, res) => {
      dispatch({ type: loadingTypes.FETCHING_FINISH });
      dispatch({
        type: actionTypes.RESEND_VERIFICATION_EMAIL_FAILED,
        payload: {
          message: `An email has been sent to ${postData.email}`,
          type: 'danger'
        }
      });
    });
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

    // ipc.on('auto-login-fail', (e, err) => {
    //   // DO NOTHING IF AUTO LOGIN FAILS?
    // });
  }
}

export const userActions = {
  autoLogin,
  login,
  logout,
  register,
  verifyEmail,
  resendEmail,
  resetPassword,
  changePassword
};