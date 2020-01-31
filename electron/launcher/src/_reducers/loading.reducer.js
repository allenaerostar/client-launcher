import * as loadingTypes from '_constants/loading.types';

const INITIAL_STATE = {
  isFetching: false
};

// Currently not using our payload to make changes to state
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case loadingTypes.FETCHING_START:
      return { isFetching: true };
    case loadingTypes.FETCHING_FINISH:
      return { isFetching: false }
    default:
      return state;
  }
}