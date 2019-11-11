import history from '../_helpers/history';

// Action creators for user handling
// API calls should go here?
const login = (username, password) => {
  history.push('/');
  return {
    type: 'LOGIN'
  };
  // dispatch({
  //   type: 'LOGIN',
  //   payload: {
  //     'username': username,
  //     'password': password,
  //   }
  // })

  
}
const logout = () => {
  return {
    type: 'LOGOUT',
  }
}
const register = (user) => async (dispatch, getState) => {
  dispatch({
    type: 'REGISTER',
    payload: user
  });

  history.push('/login');
}

export const userActions = {
  login,
  logout,
  register
};