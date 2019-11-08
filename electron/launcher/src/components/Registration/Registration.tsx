import React from 'react';
import { connect } from 'react-redux';

const Registration = () => {
  return (
    <>
      <h1>Registration Form</h1>
      <form>
        <label>Username: 
          <input type="text" name="username" placeholder="Username"></input>
        </label>
        <label>Password: 
          <input type="text" name="password" placeholder="Password"></input>
        </label>
        <label>Email: 
          <input type="text" name="email" placeholder="email"></input>
        </label>
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Registration;