import {
    DELETE_FORM_INPUT_ERROR,
    DELETE_FORM_INPUT_LOADING,
    DELETE_FORM_INPUT_RESET,
    DELETE_FORM_INPUT_SUCCESS
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case DELETE_FORM_INPUT_RESET:
            return initialState;
        case DELETE_FORM_INPUT_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case DELETE_FORM_INPUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false
            };
        case DELETE_FORM_INPUT_ERROR:
            return {
                ...state,
                isLoading: false,
                isError: action.payload,
            };
        default:
            return state;
    }
}
