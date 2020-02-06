import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { patcherActions } from '_actions';

const ipc = window.require('electron').ipcRenderer;

const Root = (props) => {

  // app start check for game client update
  useEffect(() => {
    if(props.patch.reqInitialCheck){
      props.checkForUpdate();
    }
    // eslint-disable-next-line
  }, [props.patch.reqInitialCheck]);

  useEffect(() => {
    ipc.on('fm-up-to-date', () => {
      if(props.patch.reqInitialCheck){
        props.toggleIsLatestVersion(true);
      }
    });
    ipc.on('fm-download-start', () => {
      if(props.patch.reqInitialCheck){
        props.setPatching();
      }
    });
    ipc.on('fm-download-status-update', (e, update) => {
      if(props.patch.reqInitialCheck){
        props.setUpdateStatus(update);
      }
    });

    return () => {
      ipc.removeAllListeners('fm-up-to-date');
      ipc.removeAllListeners('fm-download-start');
      ipc.removeAllListeners('fm-download-status-update');
    }
  }, [])

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
