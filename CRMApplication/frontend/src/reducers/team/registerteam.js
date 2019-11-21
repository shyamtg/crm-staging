import {
    REGISTER_TEAM_FAIL,
    REGISTER_TEAM_SUCCESS,
    REGISTER_TEAM_LOADING,
    RESET_TEAM_STATE
  } from "../../actions/types";
  
  const initialState = {
    isCreated: false,
    isLoading: false,
    isError: false,
    team: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case RESET_TEAM_STATE:
        return initialState
      case REGISTER_TEAM_SUCCESS:
        return {
          ...state,
          isCreated: false,
          isLoading: false,
          isError: false,
          user: action.payload
        };
      case REGISTER_TEAM_FAIL:
        return {
          ...state,
          isCreated: false,
          isError: action.payload,
          isLoading: false,
          user: null
        };
      case REGISTER_TEAM_LOADING:
        return {
          ...state,
          isCreated: false,
          isLoading: true,
          isError: false
        };
      default:
        return state;
    }
  }
  