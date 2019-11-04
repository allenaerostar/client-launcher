import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  setIsAuthenticated: PropTypes.func
}
// Future iterations will an action pulled from redux instead of from App
const Login = ({ setIsAuthenticated }) => {
    return (
      <>
        <h1>Login Here</h1>
        <form onSubmit={(e) => setIsAuthenticated(e)}>
          <input type="text" name="username" placeholder="Username"></input>
          <br />
          <input type="password" name="password" placeholder="Password"></input>
          <br />
          <button type="submit">Log In</button>
        </form>
        <p>First time? <Link to="/registration">Register Here!</Link></p>
      </>
    );
}

Login.propTypes = propTypes;

export default Login;