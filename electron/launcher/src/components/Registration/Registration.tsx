import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Registration = props => {

  const handleSubmit = (e) => {
    e.preventDefault();
    props.register();
  }

  const formFields = [
    {
      name: 'username',
      type: 'text'
    },
    {
      name: 'password',
      type: 'password'
    },
    {
      name: 'email',
      type: 'email'
    }
  ];
  // function for futurecases, handling fast input changes
  // const handleChange = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   if (name === 'username') {
  //     setUsername(value);
  //   } else if (name === 'password') {
  //     setPassword(value);
  //   }
  // }

  return (
    <>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        {
          formFields.map( input => (
            <>
              <label htmlFor={input.name}>{input.name}:</label>    
              <input
                id={input.name}
                type={input.type}
                name={input.name}
                placeholder={input.name}>
              </input>
            </>
          ))
        }
        {/* <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username">  
        </input>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="text"
          name="password"
          placeholder="Password">
        </input>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          name="email"
          placeholder="email">
        </input> */}
        <button type="submit">Register</button>
      </form>
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
