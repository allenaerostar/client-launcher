import * as actionTypes from '_constants/user.types';

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
    case actionTypes.LOGIN_SUCCESS:
      return { 
        ...state, 
        isAuthenticated: true, 
        user: {
          ...state.user,
          username: action.payload.user.username,
          email: action.payload.user.email,
          isActive: action.payload.user.isActive,
          isAdmin: action.payload.user.isAdmin
        }
      };
    case actionTypes.LOGIN_FAILED:
      return { ...state, isAuthenticated: false, error: action.payload.error}
    case actionTypes.LOGOUT_SUCCESS:
      return { ...state, isAuthenticated: false, user: { ...state.user, username: '', password: ''} };
    case actionTypes.LOGOUT_FAILED:
      return { ...state, error: action.payload.error };
    case actionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case actionTypes.REGISTER_FAILED:
      return { ...state, error: action.payload.error};
    case actionTypes.VERIFY_EMAIL_SUCCESS:
      return { ...state, user: {...state.user, isActive: true}};
    case actionTypes.VERIFY_EMAIL_FAILED: 
      return { ...state, error: action.payload.error};
    case actionTypes.PASSWORD_RESET_SUCCESS:
      return { ...state, error: action.payload.message };
    case actionTypes.PASSWORD_RESET_FAILED:
      return { ...state, error: action.payload.error };
    case actionTypes.RESET_ERROR:
      return { ...state, error: null};
    default:
      return state;
  }
}