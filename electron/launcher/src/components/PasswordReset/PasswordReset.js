import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';

import PreAuthContainer from 'components/PreAuthContainer';
import FormBuilder from 'components/Form/FormBuilder';

const ResetPassword = props => {

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