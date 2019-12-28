import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

const Root = (props) => {

  // app start check for game client update
  useEffect(() => {
    if(props.patch.reqInitialCheck){
      props.checkForUpdate(true);
    }
    // eslint-disable-next-line
  }, [props.patch.reqInitialCheck]);

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

export default connect(mapStateToProps, patcherActions)(Root);
