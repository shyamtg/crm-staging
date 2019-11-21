import {
    CLIENTLIST_ERROR,
    CLIENTLIST_LOADED,
    CLIENTLIST_LOADING,
  } from "../../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError: false,
    clientsList: null,
    count: null
  };
//   let clients = [];
  export default function(state = initialState, action) {
    switch (action.type) {
      case CLIENTLIST_LOADED:
        return {
          ...state,
          isLoading: false,
          isError: false,
          clientsList: action.payload.results,
          count: action.payload.count
        };
      case CLIENTLIST_ERROR:
        return {
          ...state,
          isError: action.payload,
          isLoading: false,
          clientsList: null,
          count: null
        };
      case CLIENTLIST_LOADING:
        return {
          ...state,
          isLoading: true,
          isError: false,
          clientsList: null,
          count: null
        };
      default:
        return state;
    }
  }
  