import React from 'react';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import { connect } from 'react-redux';

const UserProfile = props => {

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
