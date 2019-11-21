import {
    FORM_INPUT_DETAILS_ERROR,
    FORM_INPUT_DETAILS_LOADING,
    FORM_INPUT_DETAILS_RESET,
    FORM_INPUT_DETAILS_SUCCESS
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form_input_details: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FORM_INPUT_DETAILS_RESET:
            return initialState;
        case FORM_INPUT_DETAILS_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false,
                form_input_details:null
            };
        case FORM_INPUT_DETAILS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form_input_details: action.payload
            };
        case FORM_INPUT_DETAILS_ERROR:
            return {
                ...state,
                isLoading: false,
                form_input_details: null,
                isError: action.payload,
            };
        default:
            return state;
    }
}
