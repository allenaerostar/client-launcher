const INITIAL_STATE = {
  user: {
    username: '',
    password: '',
    email: '',
    birthday: '',
    isActive: false,
    isAdmin: false
  },
  isAuthenticated: false,
  token: null,
  error: null
}

// Currently not using our payload to make changes to state
export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, isAuthenticated: true };
    case 'LOGIN_SUCCESS':
      return { ...state, err: action.payload.error, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'REGISTER_SUCCESS':
      return { ...state, user: action.payload.user };
    case 'REGISTER_FAILED':
      return { ...state, error: action.payload.error};
    case 'VERIFY_EMAIL_SUCCESS':
      return { ...state, user: {...state.user, isActive: true}};
    case 'VERIFY_EMAIL_FAILED': 
      return { ...state, error: action.payload.error};
    default:
      return state;
  }
}