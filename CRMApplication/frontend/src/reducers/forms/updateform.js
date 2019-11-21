import {
    UPDATE_FORM_ERROR,
    UPDATE_FORM_LOADING,
    UPDATE_FORM_SUCCESS,
    UPDATE_FORM_RESET
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_FORM_RESET:
            return initialState;
        case UPDATE_FORM_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case UPDATE_FORM_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form: action.payload
            };
        case UPDATE_FORM_ERROR:
            return {
                ...state,
                isLoading: false,
                from: null,
                isError: action.payload,
            };
        default:
            return state;
    }
}
