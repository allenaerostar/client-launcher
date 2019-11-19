import React from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { Router, Route, Switch, Link} from 'react-router-dom';

import Root from 'components/Root/Root';
import Login from 'components/Login/Login';
import Registration from 'components/Registration/Registration';
import VerifyEmail from 'components/Registration/VerifyEmail';
import PrivateRoute from 'components/PrivateRoute';
import history from '_helpers/history';

import { connect } from 'react-redux';

import 'App.scss';
  
const App = props => {
  return (
    <Router history={history}>
      <div className="container">
        <Link to="/">Home</Link>
        <Switch>
          <PrivateRoute exact path="/" Component={Root} isAuthenticated={props.auth.isAuthenticated}/>
          <Route path="/login" component={Login}/>
          <Route path="/registration" component={Registration} />
          <Route path="/verify-email" component={VerifyEmail} />
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(App);
