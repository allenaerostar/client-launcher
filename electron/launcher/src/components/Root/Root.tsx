import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Root = () => {

  let logged_in = false;
  // IF NOT LOGGED IN THEN DISPLAY LOGIN PAGE
  if(!logged_in){
    return (
      <Fragment>
        <h1>Login Here</h1>
        <form>
          <input type="text" name="username" placeholder="Username"></input>
          <br />
          <input type="password" name="password" placeholder="Password"></input>
          <br />
          <button>Log In</button>
        </form>
        <p>First time? <Link to="/registration">Register Here!</Link></p>
      </Fragment>
    )
  }
  else{
    return (
      <h1>Main Page</h1>
    )
  }
}

export default Root;