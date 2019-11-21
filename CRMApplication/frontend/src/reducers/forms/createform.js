import {
    CREATE_FORM_ERROR,
    CREATE_FORM_RESET,
    CREATE_FORM_SUCCESS,
    CREATE_FORM_LOADING
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_FORM_RESET:
            return initialState;
        case CREATE_FORM_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case CREATE_FORM_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form: action.payload
            };
        case CREATE_FORM_ERROR:
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
