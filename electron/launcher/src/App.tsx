import React, { Component, useState, useEffect } from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Root from './components/Root/Root';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import PrivateRoute from './components/PrivateRoute';

import './App.scss';

// const ipc = window.require('electron').ipcRenderer;
// const ipcTest = () => {
  //   ipc.send('echo-message', 'Hello testing!');
  // }
  
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // state = {
  //     token: true,
  //     isAuthenticated: false
  //   };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsAuthenticated(true);
  }
  return (
    <Router>
      <div className="container">
        <Link to="/">Home</Link>
        <Switch>
          <PrivateRoute exact path="/" Component={Root} isAuthenticated={isAuthenticated}/>
          <Route path="/login" component={
            () => <Login setIsAuthenticated={handleSubmit}/>
          }/>
          <Route path="/registration" component={Registration} />
        </Switch>
      </div>
    </Router>
  );
}


export default App;