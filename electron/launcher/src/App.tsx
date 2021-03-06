import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Root from 'components/Root/Root';
import Login from 'components/Login/Login';
import Header from 'components/Header/Header';
import UserProfile from 'components/UserProfile/UserProfile';
import TitleBar from 'components/TitleBar';
import Registration from 'components/Registration/Registration';
import ResetPassword from 'components/PasswordReset/PasswordReset';
import VerifyEmail from 'components/Registration/VerifyEmail';
import UploaderContainer from 'components/Uploader/UploaderContainer';
import Patcher from 'components/Patcher/Patcher';
import PrivateRoute from 'components/PrivateRoute';
import UpgradePrompt from 'components/Toasts/UpgradePrompt';
import Spinner from 'components/Spinner';
import history from '_helpers/history';
import { patcherActions } from '_actions';


import { connect } from 'react-redux';

import 'App.scss';
import 'react-toastify/dist/ReactToastify.min.css';

const ipc = window.require('electron').ipcRenderer;
  
const App = props => {

  useEffect(() => {
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
  }, []);


  // SIMULATES componentWillUnmount()
  useEffect(() => {
    return () => {
      ipc.removeAllListeners('launcher-update-ready');
    }
  }, []);

  return ( 
    <div className={props.auth.isAuthenticated ? "app-container--loggedin" : ""}>
      <TitleBar />
      <Spinner />
      <Router history={history}>
        {
          (props.auth.isAuthenticated && props.auth.user.isActive) ? 
            <Header />
            :
            null
        }
          <Switch>
            <PrivateRoute exact path="/" component={Root} isAuthenticated={props.auth.isAuthenticated}/>
            <Route path="/login" component={Login}/>
            <Route path="/forgot-password" component={Registration} />
            <PrivateRoute path="/profile" component={UserProfile} isAuthenticated={props.auth.isAuthenticated}/>
            <Route path="/registration" component={Registration} />
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/reset-password" component={ResetPassword} />
            <PrivateRoute path="/admin" component={UploaderContainer} isAuthenticated={props.auth.isAuthenticated} />
          </Switch>
      </Router>
      {
        props.auth.isAuthenticated && props.patch.patching ?
          <Patcher />
          :
          null
      }
      <ToastContainer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, patcherActions)(App);
