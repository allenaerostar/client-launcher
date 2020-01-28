import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import PreAuthContainer from 'components/PreAuthContainer';

const VerifiedEmail = props => {

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
    <PreAuthContainer>
        <h1>Verify Account</h1>
        <form onSubmit={handleSubmit} className="form-inline">
          <label htmlFor="verify_token">Verification Code: </label>
          <input
            id="verify_token"
            type="text"
            value={postData.verify_token}
            onChange={handleChange}
            className="form-control"
          >  
          </input>
          <button className="btn btn-success" type="submit">OK</button>
        </form>
        <button className="btn btn-primary btn-resend" onClick={resendEmail}>Re-send Verification Email</button>
        <Link to="/login">
          > Login
        </Link>
    </PreAuthContainer>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(VerifiedEmail);