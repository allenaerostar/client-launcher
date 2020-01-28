export default (state = {}, action) => {

  const matches = /(.*)_(SUCCESS|FAILED)/.exec(action.type);

  if (action.type === 'CLEAR_ALERT')
    return {
      ...state,
      message: null,
      type: null,
    }
    
  // if not a *_SUCCESS / *_FAILED action, ignore it
  if (!matches || !action.payload)
    return state;

  return {
    ...state,
    message: action.payload.message,
    type: action.payload.type
  };
};