import React, { useEffect, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import PreAuthContainer from 'components/PreAuthContainer';

const ipc = window.require('electron').ipcRenderer;

// Future iterations will an action pulled from redux instead of from App
const Login = props => {

  // Attempts to login automatically from stored session or credentials
  useEffect(() => {
    props.autoLogin();
    // eslint-disable-next-line
  });

  useEffect(() => {
    ipc.on('auto-login-success', (e, res) => {
      props.loginSuccess(res);
    });
    ipc.on('http-login-credentials-success', (e, res) => {
      props.loginSuccess(res);
    });
    ipc.on('http-login-credentials-fail', (e, err) => {
      props.loginFailed();
    });

    return () => {
      ipc.removeAllListeners('uto-login-success');
      ipc.removeAllListeners('http-login-credentials-success');
      ipc.removeAllListeners('http-login-credentials-fail');
    }
  }, [])

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true
    }
  ];

  return (
      <PreAuthContainer>
        <h1>Login</h1>
        <FormBuilder
          formFields={formFields}
          submitFunction={props.login}
          errorMessageGenerator={false}
          submitText={"Login"}
        />
        <Link to="/registration">
          > Create an account
        </Link>
        <Link to="/reset-password">
          > Forgot your password?
        </Link>
    </PreAuthContainer>
  );
};

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Login);
