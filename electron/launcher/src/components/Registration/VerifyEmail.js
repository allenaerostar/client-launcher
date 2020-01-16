import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import logo from 'assets/dietstory_logo.png';

const VerifiedEmail = props => {

  useEffect(() => {
    if(props.auth.error !== null){
      let error = JSON.parse(props.auth.error.error);
      alert(error.message);
      props.resetError();
    }
    // eslint-disable-next-line
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
    <div className="row no-gutters">
      <section className="hero-image col-8">
        <img src={logo} className="img-fluid" width="228" height="96" alt="dietstory" />
      </section>
      <section className="col-4 form__container">
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
      </section>
    </div>
  );
}
const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(VerifiedEmail);