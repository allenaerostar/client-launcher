import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';

import Patcher from 'components/Patcher/Patcher';

const Root = (props) => {

  const logout = () => {
    props.logout(props.auth.user);
  }
  
  return (
    <section>
      <Patcher />
      <button onClick={logout}>logout</button>
    </section>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Root);
