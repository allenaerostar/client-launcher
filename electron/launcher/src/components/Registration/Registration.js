import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';
import logo from 'assets/dietstory_logo.png';

const Registration = props => {

  // Error handling
  useEffect(() => {
    if(props.auth.error !== null){
      let error = JSON.parse(props.auth.error.error);
      alert(error.message);
      props.resetError();
    }
    // eslint-disable-next-line
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
    <div className="row no-gutters">
      <section className="hero-image col-8">
        <img src={logo} className="img-fluid" width="228" height="96" alt="dietstory-logo"/>
      </section>
      <section className="col-4 form__container">
        <h1>Registration</h1>
        <FormBuilder 
          formFields={formFields}
          submitFunction={props.register}
          errorMessageGenerator={errorMessageGenerator}
          submitText={"Register"}
        />
        <Link to="/login">
          > Login
        </Link>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);
