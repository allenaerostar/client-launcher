import { combineReducers } from 'redux';
import authentication from '_reducers/authentication.reducer';
import patcher from '_reducers/patcher.reducer';
import client from '_reducers/client.reducer';

export default combineReducers({
  auth: authentication,
  patch: patcher,
  client
});