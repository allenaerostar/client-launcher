import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import logo from 'assets/dietstory_logo.png';

// Future iterations will an action pulled from redux instead of from App
const ForgotPassword = props => {

  // Error handling 
  useEffect(() => {
    if (props.auth.error !== null) {
      alert(props.auth.error.message);
      props.resetError();
    }
    // eslint-disable-next-line
  }, [props.auth.error]);

  const formFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'verify_token',
      label: 'Verification Code',
      type: 'text',
      required: true
    },
    {
      name: 'new_password',
      label: 'New Password',
      type: 'password',
      required: true
    },
    {
      name: 'new_password2',
      label: 'Confirm Password',
      type: 'password',
      required: true
    }
  ];

  return (
    <div className="row no-gutters">
      <section className="hero-image col-8">
        <img src={logo} className="img-fluid" width="228" height="96" alt="dietstory" />
      </section>
      <section className="col-4 form__container">
        <h1>Forgot your password?</h1>
        <FormBuilder
          formFields={formFields}
          submitFunction={props.login}
          errorMessageGenerator={false}
          submitText={"Change Password"}
        />
        <Link to="/login">
          > Login
        </Link>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(ForgotPassword);
