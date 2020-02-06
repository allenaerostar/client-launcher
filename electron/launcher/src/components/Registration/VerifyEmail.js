import React, { useEfect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import PreAuthContainer from 'components/PreAuthContainer';

const ipc = window.require('electron').ipcRenderer;

const VerifiedEmail = props => {

  useEfect(() => {
    ipc.on('http-verify-email-success', (e, res) => {
      props.verifyEmailSuccess();
    });
    ipc.on('http-verify-email-fail', (e, err) => {
      props.verifyEmailFailed();
    });
    ipc.on('http-resend-verification-email-success', (e, res) => {
      props.resendEmailSuccess();
    });
    ipc.on('http-resend-verification-email-fail', (e, res) => {
      props.resendEmailFailed();
    });

    return () => {
      ipc.removeAllListeners('http-verify-email-success');
      ipc.removeAllListeners('http-verify-email-fail');
      ipc.removeAllListeners('http-resend-verification-email-success');
      ipc.removeAllListeners('http-resend-verification-email-fail');
    }
  }, [])

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