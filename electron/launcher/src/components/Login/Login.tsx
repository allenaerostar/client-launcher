import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

// Future iterations will an action pulled from redux instead of from App
const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.login();
  }

  // function for futurecases, handling fast input changes
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if(name === 'username') {
      setUsername(value);
    } else if(name === 'password'){
      setPassword(value);   
    }
  }

  return (
    <>
      <h1>Login Here</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        >
        </input>
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password" 
          placeholder="Password"
          onChange={handleChange}
        >
        </input>
        <br />
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
