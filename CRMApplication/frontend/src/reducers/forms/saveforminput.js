import {
    FORM_INPUT_SAVING,
    FORM_INPUT_ERROR,
    FORM_INPUT_SUCCESS,
    FORM_INPUT_SAVE_RESET

} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    form_input: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FORM_INPUT_SAVE_RESET:
            return initialState;
        case FORM_INPUT_SAVING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case FORM_INPUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                form_input: action.payload
            };
        case FORM_INPUT_ERROR:
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
