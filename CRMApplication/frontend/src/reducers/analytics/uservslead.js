import {
    ANA_USER_LEAD_ERROR,
    ANA_USER_LEAD_LOADING,
    ANA_USER_LEAD_RESET,
    ANA_USER_LEAD_SUCCESS
} from "../../actions/types";

const initialState = {
    isLoading: false,
    isError: false,
    data: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ANA_USER_LEAD_RESET:
            return initialState;
        case ANA_USER_LEAD_LOADING:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case ANA_USER_LEAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            };
        case ANA_USER_LEAD_ERROR:
            return {
                ...state,
                isLoading: false,
                data: null,
                isError: action.payload,
            };
        default:
            return state;
    }
}
