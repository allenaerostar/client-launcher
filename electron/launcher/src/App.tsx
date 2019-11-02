import React, { Component } from 'react';
import { isSafeToUnpackElectronOnRemoteBuildServer } from 'app-builder-lib/out/platformPackager';

import './App.css';

class App extends Component {

  state = {}

  render() {
    return (
      <div className="container">Hello</div>
    );
  }
}

export default App;