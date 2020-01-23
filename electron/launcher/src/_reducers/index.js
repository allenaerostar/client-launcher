import { combineReducers } from 'redux';
import authentication from '_reducers/authentication.reducer';
import patcher from '_reducers/patcher.reducer';
import loading from '_reducers/loading.reducer';

export default combineReducers({
  auth: authentication,
  patch: patcher,
  loading
});