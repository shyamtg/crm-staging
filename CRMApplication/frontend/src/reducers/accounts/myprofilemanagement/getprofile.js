import { MYPROFILE_LOADING, MYPROFILE_LOADED, MYPROFILE_RESET } from "../../../actions/types";

const initialState = {
  isLoading: false,
  user: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MYPROFILE_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case MYPROFILE_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload
      };
    case MYPROFILE_RESET:
      return {
        _persist: state._persist
      }
    default:
      return state;
  }
}
