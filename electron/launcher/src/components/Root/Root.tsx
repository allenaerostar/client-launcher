import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';

const Root = (props) => {

  const logout = () => {
    props.logout(props.auth.user);
  }
  
  return (
    <section>
      <h1>Logged In</h1>
      <button onClick={logout}>logout</button>
    </section>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Root);
