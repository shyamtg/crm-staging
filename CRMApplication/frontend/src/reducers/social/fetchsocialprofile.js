import {
    SEARCHED_SOCIAL_PROFILE,
    SEARCHING_SOCIAL_PROFILE,
    SEARCH_SOCIAL_PROFILE_ERROR
  } from "../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError : false,
    result: []
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case SEARCHED_SOCIAL_PROFILE:
        return {
          ...state,
          isLoading: false,
          result: action.payload
        }
      case SEARCHING_SOCIAL_PROFILE:
        return {
          ...state,
          isLoading: true,
          result: []
        };
        case SEARCH_SOCIAL_PROFILE_ERROR:
            return {
              ...state,
              isLoading: false,
              isError: action.payload
            };
      default:
        return state;
    }
  }
  