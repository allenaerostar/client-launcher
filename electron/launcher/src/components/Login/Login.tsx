import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import logo from 'assets/dietstory_logo.png';

const Login = props => {
  
  // Attempts to login automatically from stored session or credentials
  useEffect(() => {
    props.autoLogin();
    // eslint-disable-next-line
  });

  // Error handling 
  useEffect(() => {
    if(props.auth.error !== null){
      alert(props.auth.error.message);
      props.resetError();
    }
    // eslint-disable-next-line
  }, [props.auth.error]);

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
      <div className="row no-gutters">
        <section className="hero-image col-8">
          <img src={logo} className="img-fluid" width="228" height="96" alt="dietstory"/>
        </section>
        <section className="col-4 form__container">
          <h1>Sign In</h1>
          <FormBuilder
            formFields={formFields}
            submitFunction={props.login}
            errorMessageGenerator={false}
            submitText={"Login"}
          />
          <Link to="/registration">
            > Create an account
          </Link>
          <Link to="/forgot-password">
            > Forgot your password?
          </Link>
          <Link to="/verify-email">
            > Verify your email
          </Link>
        </section>
      </div>
  );
};

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Login);
