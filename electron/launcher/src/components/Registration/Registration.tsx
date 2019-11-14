import React, { useState } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Registration = props => {

  // const [username, setUsername] = useState('');
  // const [password1, setPassword1] = useState('');
  // const [password2, setPassword2] = useState('');
  // const [email, setEmail] = useState('');
  // const [birthday, setBirthday] = useState('');

  const [inputs, setInputs] = useState({
    'username': '',
    'password': '',
    'confirm-password': '',
    'email': '',
    'birthday': '',
  });

  const [formErrors, setFormErrors] = useState({

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    props.register(inputs);
  }

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text'
    },
    {
      name: 'password1',
      label: 'Password',
      type: 'password'
    },
    {
      name: 'password2',
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
    setInputs(inputs => ({
      ...inputs, [name]: value
    }));
  }
  
  const validateField = (fieldName, value) => {
    // let fieldValidationErrors = errors;
    let errorMessage = '';
    switch(fieldName) {
      case 'username':
        if(!value.match(/^[a-zA-Z0-9_]+$/)) errorMessage = "Username must contain only Alphanumeric characters and underscores."
        break;
      case 'password':
        if (value.length < 6) errorMessage = "Password length must be at least 6 characters."
        break;
      case 'confirm-password':        
        if (inputs["password"] !== value) errorMessage = "Confirm password should match password."
        break;
      case 'email':
        if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) errorMessage = "Please enter a valid email address."
        break;
      default:
        break;
    }
    // Setform errors here
  
  }

  return (
    <>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        {
          formFields.map( (input, i) => (
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
        <button type="submit">Register</button>
      </form>
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
