import { combineReducers } from 'redux';
import authentication from './authentication.reducer';

export default combineReducers({
  isAuthenticated: authentication
});