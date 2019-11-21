import {
    GET_FORMS_INPUTS_ERROR,
    GET_FORMS_INPUTS_LOADING,
    GET_FORMS_INPUTS_RESET,
    GET_FORMS_INPUTS_SUCCESS,
    FORMS_INPUTS_DELETED
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form_input: null,
    count: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FORMS_INPUTS_RESET:
            return initialState;
        case GET_FORMS_INPUTS_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case GET_FORMS_INPUTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form_input: action.payload.results,
                count: action.payload.count
            };
        case FORMS_INPUTS_DELETED:
            let form_input = state.form_input;
            if (form_input) {
                form_input = form_input.filter(function (el) {
                    return action.payload != el.id;
                });
            }
            return {
                ...state,
                form_input: form_input
            };
        case GET_FORMS_INPUTS_ERROR:
            return {
                ...state,
                isLoading: false,
                form_input: null,
                isError: action.payload,
            };
        default:
            return state;
    }
}
