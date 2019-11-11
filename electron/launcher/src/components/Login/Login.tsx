import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

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
  }, []);

  const [inputs, setInputs] = useState({
    'username': '',
    'password': ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.login();
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs( inputs => ({
      ...inputs, [name]: value
    }));
  }

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password'
    }
  ];

  return (
    <>
      <h1>Login Here</h1>
      <form onSubmit={handleSubmit}>
        {
          formFields.map((input, i) => (
            <React.Fragment key={i}>
              <label htmlFor={input.name}>{input.label}:</label>
              <input
                id={input.name}
                type={input.type}
                name={input.name}
                placeholder={input.label}
                onChange={handleChange}
              >
              </input>
              <br />
            </React.Fragment>
          ))
        }
        <button type="submit">Log In</button>
      </form>
      <p>First time? <Link to="/registration">Register Here!</Link></p>
    </>
  );
};

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Login);
