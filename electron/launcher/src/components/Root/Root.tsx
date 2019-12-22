import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';

const Root = (props) => {

  return (
    <section className="container">
      <div className="row">
        <div className="hero-card col-12">
          <h1>Welcome!</h1>
          <p>Enjoy your stay!</p>
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, userActions)(Root);
