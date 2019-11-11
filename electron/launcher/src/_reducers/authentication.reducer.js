const INITIAL_STATE = {
  isAuthenticated: false,
}

// Currently not using our payload to make changes to state
export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'REGISTER':
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}