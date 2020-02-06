import React, { useEffect } from 'react';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import { connect } from 'react-redux';

const ipc = window.require('electron').ipcRenderer;

const UserProfile = props => {

  useEffect(() => {
    ipc.on('http-change-password-success', (e, res) => {
      props.changePasswordSuccess();
    });
    ipc.on('http-change-password-fail', (e, err) => {
      props.changePasswordFailed();
    });

    return () => {
      ipc.removeAllListeners('http-change-password-success');
      ipc.removeAllListeners('http-change-password-fail');
    }
  }, []);

  const formFields = [
    {
      name: 'old_password',
      label: 'Current password',
      type: 'password',
      required: true
    },
    {
      name: 'new_password1',
      label: 'New password',
      type: 'password',
      required: true
    },
    {
      name: 'new_password2',
      label: 'Confirm new password',
      type: 'password',
      required: true
    }
  ];

  return (
    <>
      <h1>Change Password</h1>
      <FormBuilder
        formFields={formFields}
        submitFunction={props.changePassword}
        errorMessageGenerator={false}
        submitText={"Change Password"}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(UserProfile);
