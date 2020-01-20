import { combineReducers } from 'redux';
import authentication from '_reducers/authentication.reducer';
import patcher from '_reducers/patcher.reducer';
import uploader from '_reducers/uploader.reducer';

export default combineReducers({
  auth: authentication,
  patch: patcher,
  uploader: uploader
});