import React, { useEffect } from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { Router, Route, Switch } from 'react-router-dom';

import Root from 'components/Root/Root';
import Login from 'components/Login/Login';
import Header from 'components/Header/Header';
import UserProfile from 'components/UserProfile/UserProfile';
import TitleBar from 'components/TitleBar';
import Registration from 'components/Registration/Registration';
import VerifyEmail from 'components/Registration/VerifyEmail';
import Uploader from 'components/Uploader/Uploader';
import Patcher from 'components/Patcher/Patcher';
import PrivateRoute from 'components/PrivateRoute';
import history from '_helpers/history';
// import { userActions } from '_actions';
import { patcherActions } from '_actions';

import { connect } from 'react-redux';

import 'App.scss';

const App = props => {

  useEffect(() => {
    props.checkForUpdate();
    // eslint-disable-next-line
  }, [])

  return ( 
    <div className={props.auth.isAuthenticated ? "app-container--loggedin" : ""}>
      <TitleBar />
      <Router history={history}>
        {
          props.auth.isAuthenticated ? 
            <Header />
            :
            null
        }
          <Switch>
            <PrivateRoute exact path="/" component={Root} isAuthenticated={props.auth.isAuthenticated}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/profile" component={UserProfile} isAuthenticated={props.auth.isAuthenticated}/>
            <Route path="/registration" component={Registration} />
            <Route path="/verify-email" component={VerifyEmail} />
            <PrivateRoute path="/admin" component={Uploader} isAuthenticated={props.auth.user.isAdmin}/>
          </Switch>
      </Router>
      {
        props.auth.isAuthenticated && !props.patch.isLatest ?
          <Patcher />
          :
          null
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     checkForUpdate: patcherActions.checkForUpdate
//   }
// }

export default connect(mapStateToProps, patcherActions)(App);
