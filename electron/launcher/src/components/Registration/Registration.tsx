import React, { useState } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { AppErrors } from '../AppErrors';

const Registration = props => {

  const [inputs, setInputs] = useState({
    'username': '',
    'password1': '',
    'password2': '',
    'email': '',
    'birthday': '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let submittable = checkFormErrors();
    if(submittable){
      props.register(inputs);
    }
  }

  const checkFormErrors = () =>{
    for (let key in formErrors) {
      if (formErrors[key] !== "") {
        return false;
      }
    }
    return true;
  }

  const formFields = [
    {
      name: 'email',
      type: 'email'
    },
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
      type: 'date'
    }
  ];

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(inputs => ({
      ...inputs, [name]: value
    }));

    validateField(name, value);
  }
  
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch(fieldName) {
      case 'username':
        if(!value.match(/^[a-zA-Z0-9_]+$/)) errorMessage = "Username must contain only Alphanumeric characters and underscores."
        break;
      case 'password1':
        if (value.length < 6) errorMessage = "Password length must be at least 6 characters."
        break;
      case 'password2':        
        if (inputs["password1"] !== value) errorMessage = "Confirm password should match password."
        break;
      case 'email':
        if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) errorMessage = "Please enter a valid email address."
        break;
      default:
        break;
    }

    setFormErrors(errors => ({
      ...errors, [fieldName]: errorMessage
    }));
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
              {
                !!formErrors[input.name] && formErrors[input.name].length > 0 ?
                  <p>{formErrors[input.name]}</p>
                : null  
              }
              <br />
            </React.Fragment>
          ))
        }
        <button type="submit">Register</button>
      </form>
    </>
  );
}

// All of redux store state as argument
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
