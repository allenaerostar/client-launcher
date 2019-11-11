import React, { useState } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Registration = props => {
  const [inputs, setInputs] = useState({
    'email': '',
    'username': '',
    'password': ''
  });

  const formFields = [
    {
      name: 'email',
      type: 'email'
    },
    {
      name: 'username',
      type: 'text'
    },
    {
      name: 'password',
      type: 'password'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    props.register(inputs);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(inputs => ({...inputs, [name]: value}));
  }

  return (
    <>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        {
          formFields.map( (input,i) => (
            <React.Fragment key={i}>
              <label htmlFor={input.name}>{input.name}:</label>    
              <input
                id={input.name}
                type={input.type}
                name={input.name}
                placeholder={input.name}
                onChange={handleChange}
                value={inputs[input.name]}
                required
              >
              </input>
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