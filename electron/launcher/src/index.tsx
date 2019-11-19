import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from 'App';
import reducers from '_reducers';

// Hook up thunk middleware to redux store
const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  // Load up our redux store with our reducers
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


