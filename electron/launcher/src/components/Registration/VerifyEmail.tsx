import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const VerifiedEmail = props => {

  useEffect(() => {
    if(props.auth.error !== null){
      let error = JSON.parse(props.auth.error.error);
      alert(error.message);
      props.resetError();
    }
  }, [props.auth.error]);

  const [postData, setPostData] = useState({
    'email': props.auth.user.email,
    'verify_token': ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.verifyEmail(postData);
  }

  const resendEmail = (e) => {
    props.resendEmail({email: props.auth.user.email});
  }

  const handleChange = (e) => {
    const val = e.target.value;
    setPostData(postData => ({
      email: postData.email,
      verify_token: val
    }));
  }

  return (
    <>
      <h1>Verify Account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="verify_token">Verification Code: </label>
        <input id="verify_token" type="text" value={postData.verify_token} onChange={handleChange}></input>
        <button type="submit">OK</button>
        <br></br>
        <a href='#resend' onClick={resendEmail}>Re-send Verification Email</a>
      </form>
    </>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(VerifiedEmail);