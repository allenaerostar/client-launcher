import React, { useState } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Registration = props => {

  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    let user = {
      username: username,
      password1: password1,
      password2: password2,
      email: email,
      birthday: birthday
    }
    e.preventDefault();
    props.register(user);
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
    },
    {
      name: 'confirm-password',
      label: 'Confirm Password',
      type: 'password'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      name: 'birthday',
      label: 'Birthday',
      type: 'text'
    }
  ];
  // function for futurecases, handling fast input changes
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword1(value);
    } else if (name === 'confirm-password') {
      setPassword2(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'birthday') {
      setBirthday(value);
    }
  }

  return (
    <>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        {
          formFields.map( input => (
            <>
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
            </>
          ))
        }
        <button type="submit">Register</button>
      </form>
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
