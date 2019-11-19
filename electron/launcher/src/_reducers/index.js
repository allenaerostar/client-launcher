import { combineReducers } from 'redux';
import authentication from '_reducers/authentication.reducer';

export default combineReducers({
  auth: authentication
});