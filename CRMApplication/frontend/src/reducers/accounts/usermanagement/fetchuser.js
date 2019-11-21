import {
  USERDETAILS_LOADED,
  USERDETAILS_LOADING,
  USERDETAILS_ERROR,
  RESET_USER_STATE
} from "../../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_USER_STATE:
      return initialState;
    case USERDETAILS_LOADED:
      return {
        ...state,
        isLoading: false,
        isError: false,
        user: action.payload
      };
    case USERDETAILS_ERROR:
      return {
        ...state,
        isError: action.payload,
        isLoading: false,
        user: null
      };
    case USERDETAILS_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        user: null
      };
    default:
      return state;
  }
}
