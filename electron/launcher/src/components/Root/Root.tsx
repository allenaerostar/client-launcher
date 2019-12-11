import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';

import Patcher from 'components/Patcher/Patcher';

const Root = (props) => {

  return (
    <section>
      <Patcher />
    </section>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Root);
