import React from 'react';
import { Link } from 'react-router-dom';

function Root() {

  var logged_in = false;

  // IF NOT LOGGED IN THEN DISPLAY LOGIN PAGE
  if(!logged_in){
    return (
      <React.Fragment>
        <h1>Login Here</h1>
        <form>
          <input type="text" name="username" placeholder="Username"></input>
          <br />
          <input type="password" name="password" placeholder="Password"></input>
          <br />
          <button>Log In</button>
        </form>
        <p>First time? <Link to="/registrations">Register Here!</Link></p>
      </React.Fragment>
    )
  }
  else{
    return (
      <h1>Main Page</h1>
    )
  }
}

export default Root;