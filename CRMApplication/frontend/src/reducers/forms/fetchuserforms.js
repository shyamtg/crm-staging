import {
    USER_FORMS_ERROR,
    USER_FORMS_LOADING,
    USER_FORMS_RESET,
    USER_FORMS_SUCCESS,
    USER_FORMS_DELETED
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    forms: null,
    count: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_FORMS_RESET:
            return initialState;
        case USER_FORMS_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case USER_FORMS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                forms: action.payload.results,
                count: action.payload.count
            };
        case USER_FORMS_DELETED:
            let forms = state.forms;
            if (forms) {
                forms = forms.filter(function (el) {
                    return action.payload != el.form.id;
                });
            }
            return {
                ...state,
                forms: forms
            };
        case USER_FORMS_ERROR:
            return {
                ...state,
                isLoading: false,
                forms: null,
                isError: action.payload,
            };
        default:
            return state;
    }
}
