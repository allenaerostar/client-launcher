import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';

import PreAuthContainer from 'components/PreAuthContainer';
import FormBuilder from 'components/Form/FormBuilder';

const ipc = window.require('electron').ipcRenderer;

const ResetPassword = props => {

  useEffect(() => {
    ipc.on('http-reset-password-success', (e, res) => {
      props.resetPasswordSuccess();
    });
    ipc.on('http-reset-password-fail', (e, err) => {
      props.resetPasswordFailed();
    });

    return () => {
      ipc.removeAllListeners('http-reset-password-success');
      ipc.removeAllListeners('http-reset-password-fail');
    }
  }, []);

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    }
  ];
  
  return (
    <PreAuthContainer>
      <h1>Reset Password</h1>
      <FormBuilder
        formFields={formFields}
        submitFunction={props.resetPassword}
        errorMessageGenerator={false}
        submitText={"Reset Password"}
      />
      <Link to="/login">
        > Login
      </Link>
    </PreAuthContainer>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(ResetPassword);