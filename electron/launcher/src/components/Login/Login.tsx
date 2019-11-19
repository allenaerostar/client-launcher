import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/FormBuilder';

// Future iterations will an action pulled from redux instead of from App
const Login = props => {

  // Attempts to login automatically from stored session or credentials
  useEffect(() => {
    if(props.auth.user.password !== ''){
      props.login({
        username: props.auth.user.username,
        password: props.auth.user.password
      });
    }
    // eslint-disable-next-line
  });

  // Error handling 
  useEffect(() => {
    if(props.auth.error !== null){
      console.log(props.auth.error);
      let error = JSON.parse(props.auth.error.error);
      alert(error.message);
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
    <>
      <h1>Login Here</h1>
      <FormBuilder
        formFields={formFields}
        submitFunction={props.login}
        errorMessageGenerator={false}
        submitText={"Login"}
      />
      <p>First time? <Link to="/registration">Register Here!</Link></p>
    </>
  );
};

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Login);
