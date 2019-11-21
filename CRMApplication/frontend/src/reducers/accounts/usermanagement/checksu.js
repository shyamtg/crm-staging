import {
    VALIDATED_SU,
    VALIDATING_SU
  } from "../../../actions/types";
  
  const initialState = {
    isLoading: false,
    issu: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
     
      case VALIDATED_SU:
        return {
          ...state,
          isLoading: false,
          issu: action.payload
        };
      case VALIDATING_SU:
        return {
          ...state,
          isLoading: true,
          issu: false
        };
      default:
        return state;
    }
  }
  