import React from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Root from 'components/Root/Root';
import Login from 'components/Login/Login';
import Header from 'components/Header/Header';
import Registration from 'components/Registration/Registration';
import VerifyEmail from 'components/Registration/VerifyEmail';
import PrivateRoute from 'components/PrivateRoute';
import history from '_helpers/history';
import UpgradePrompt from 'components/Toasts/UpgradePrompt';

import { connect } from 'react-redux';

import 'App.scss';
import 'react-toastify/dist/ReactToastify.min.css';

const ipc = window.require('electron').ipcRenderer;
  
const App = props => {

  // LISTENS FOR UPDATE FROM MAIN PROCESS
  ipc.on('launcher-update-ready', e => {
    toast.info(<UpgradePrompt />, {
      position: "bottom-right",
      closeButton: false,
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      className: 'upgrade-prompt',
      bodyClassName: 'upgrade-prompt-body'
    });
  });

  return ( 
     <div className={props.auth.isAuthenticated ? "app-container--loggedin" : ""}>
      <Router history={history}>
        {
          props.auth.isAuthenticated ? 
            <Header />
            :
            null
        }
          <Switch>
            <PrivateRoute exact path="/" Component={Root} isAuthenticated={props.auth.isAuthenticated}/>
            <Route path="/login" component={Login}/>
            <Route path="/registration" component={Registration} />
            <Route path="/verify-email" component={VerifyEmail} />
          </Switch>
      </Router>
      <ToastContainer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(App);
