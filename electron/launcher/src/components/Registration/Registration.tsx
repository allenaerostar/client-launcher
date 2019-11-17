import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import FormBuilder from '../FormBuilder';

const Registration = props => {

  // Error handling
  useEffect(() => {
    if(props.auth.error !== null){
      let error = JSON.parse(props.auth.error.error);
      alert(error.message);
      props.resetError();
    }
  }, [props.auth.error]);

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true
    },
    {
      name: 'password1',
      label: 'Password',
      type: 'password',
      required: true
    },
    {
      name: 'password2',
      label: 'Confirm Password',
      type: 'password',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'birthday',
      label: 'Birthday',
      type: 'date',
      required: true
    }
  ];
  
  const errorMessageGenerator = (fieldName, value, formObj) => {
    switch(fieldName) {
      case 'username':
        if(!value.match(/^[a-zA-Z0-9_]+$/)) {
          return "Username must contain only Alphanumeric characters and underscores."
        }
        break;
      case 'password1':
        if (value.length < 6) {
          return "Password length must be at least 6 characters.";
        }
        break;
      case 'password2':        
        if (formObj["password1"] !== value) { 
          return "Confirm password should match password.";
        }
        break;
      case 'email':
        if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          return "Please enter a valid email address.";
        }
        break;
      default:
        break;
    }
  }

  return (
    <>
      <h1>Registration Form</h1>
      <FormBuilder 
        formFields={formFields}
        submitFunction={props.register}
        errorMessageGenerator={errorMessageGenerator}
        submitText={"Register"}
      />
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
