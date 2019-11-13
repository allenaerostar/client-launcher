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

  const handleSubmit = (e) => {
    // let user = {
    //   username: username,
    //   password1: password1,
    //   password2: password2,
    //   email: email,
    //   birthday: birthday
    // }
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