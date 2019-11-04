import React from 'react';

const Registration = () => {
  return (
    <>
      <form>
        <h1>Registration Form</h1>
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