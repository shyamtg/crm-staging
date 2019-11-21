import {
    FORM_DETAILS_ERROR,
    FORM_DETAILS_LOADING,
    FORM_DETAILS_RESET,
    FORM_DETAILS_SUCCESS
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FORM_DETAILS_RESET:
            return initialState;
        case FORM_DETAILS_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case FORM_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form: action.payload
            };
        case FORM_DETAILS_ERROR:
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
