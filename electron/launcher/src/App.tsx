import React from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { Router, Route, Switch, Link} from 'react-router-dom';

import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import PrivateRoute from './components/PrivateRoute';
import history from './_helpers/history';

import { connect } from 'react-redux';

import './App.scss';

// const ipc = window.require('electron').ipcRenderer;
// const ipcTest = () => {
  //   ipc.send('echo-message', 'Hello testing!');
  // }
  
const App = props => {

  return (
    <Router history={history}>
      <div className="container">
        <Link to="/">Home</Link>
        <Switch>
          <PrivateRoute exact path="/" Component={Root} isAuthenticated={props.isAuthenticated}/>
          <Route path="/login" component={Login}/>
          <Route path="/registration" component={Registration} />
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(App);
