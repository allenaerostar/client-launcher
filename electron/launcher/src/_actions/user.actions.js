import history from '../_helpers/history';

// Action creators for user handling
// API calls should go here?
const login = (user) => async (dispatch) => {
  // REPLACE ASYNC CALL HERE WITH CALL TO ELECTRON NOW
  console.log(user);
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // RESPONSE FROM ELECTRON WILL BE SENT TO PAYLOAD
  dispatch({
    type: 'LOGIN',
    payload: response
  });

  history.push('/');
}

const logout = () => {
  return {
    type: 'LOGOUT',
  }
}
const register = (user) => async (dispatch) => {
  // REPLACE ASYNC CALL HERE WITH CALL TO ELECTRON NOW
  console.log(user);
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // RESPONSE FROM ELECTRON WILL BE SENT TO PAYLOAD
  dispatch({
    type: 'REGISTER',
    payload: response
  });

  history.push('/login');
}
  
export const userActions = {
  login,
  logout,
  register
};