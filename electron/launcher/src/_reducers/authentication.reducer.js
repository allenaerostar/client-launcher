// const INITIAL_STATE = {
//   isAuthenticated: false,
// }

// Currently not using our payload to make changes to state
export default (isAuthenticated = false, action) => {
  switch(action.type) {
    case 'LOGIN':
      return isAuthenticated = true;
      // return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return isAuthenticated = false;
      // return { ...state, isAuthenticated: false };
    case 'REGISTER':
      return isAuthenticated = false;
      // return { ...state, isAuthenticated: true };
    default:
      // return state;
      return isAuthenticated;
  }
}