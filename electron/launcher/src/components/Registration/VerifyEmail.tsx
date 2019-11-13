import React, { useState } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Registration = props => {

  const [postData, setPostData] = useState({
    'email': props.auth.user.email,
    'verify_token': ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.verifyEmail(postData);
  }

  const handleChange = (e) => {
    setPostData(postData => ({
      ...postData, [e.target.id]: e.target.value
    }));
  }

  return (
    <>
      <h1>Verify Account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="verify_token">Verification Code: </label>
        <input id="verify_token" type="text" onChange={handleChange}></input>
        <button type="submit">OK</button>
        {/* 
        Future re-send verification code option? 
        Possibly need a cool down timer so users can't spam with our gmail account.
        */}
      </form>
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Registration);