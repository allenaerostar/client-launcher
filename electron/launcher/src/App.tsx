import React, { Component } from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager'; 
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Root from './components/Root/Root';
import Registration from './components/Registration/Registration';

import './App.scss';

const ipc = window.require('electron').ipcRenderer;

class App extends Component {

  state = {
    token: true
  }

  ipcTest = () => {
    ipc.send('echo-message', 'Hello testing!');
  }

  // <Route exact path="/test" component={Test} />

  render() {
    return (
      <Router>
          <div className="App">
            <div className="container">
              <Route exact path="/" component={Root} />
              <Route path="/registration" component={Registration} />
            </div>
          </div>
      </Router>
    );
  }
}

export default App;