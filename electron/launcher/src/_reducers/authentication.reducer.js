const INITIAL_STATE = {
  user: {
    username: '',
    password: '',
    email: '',
    birthday: ''
  },
  isAuthenticated: false,
  token: null,
  error: null
}

// Currently not using our payload to make changes to state
export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload.user };
    case 'REGISTER_FAILED':
      return { ...state, error: action.payload.error}
    default:
      return state;
  }
}