import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {
    GET_FORMS_INPUTS_ERROR,
    GET_FORMS_INPUTS_LOADING,
    GET_FORMS_INPUTS_SUCCESS,
    FORM_INPUT_DETAILS_LOADING,
    FORM_INPUT_DETAILS_ERROR,
    FORM_INPUT_DETAILS_SUCCESS
} from "../types";
import {qargsToQstring} from "../common";

export const ac_getFormInput = (id) => (dispatch, getState) => {

    dispatch({ type: FORM_INPUT_DETAILS_LOADING });
    api
        .get("/form_data/" + id.toString() + "/", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FORM_INPUT_DETAILS_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            let err_msg = "";
            if ("detail" in err.response.data) {
                err_msg = err.response.data.detail;
            } else {
                for (var key in err.response.data) {
                    err_msg += err.response.data[key];
                }
            }
            dispatch({
                type: FORM_INPUT_DETAILS_ERROR,
                payload: err_msg
            });
        });
};

export const ac_fetchUserFormInputs = (query_args={}) => (dispatch, getState) => {
    let query_string = qargsToQstring(query_args);
    dispatch({ type: GET_FORMS_INPUTS_LOADING });
    let api_url = "/form_data/"+query_string;
    api
        .get(api_url, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_FORMS_INPUTS_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            let err_msg = "";
            if ("detail" in err.response.data) {
                err_msg = err.response.data.detail;
            } else {
                for (var key in err.response.data) {
                    err_msg += err.response.data[key];
                }
            }
            dispatch({
                type: GET_FORMS_INPUTS_ERROR,
                payload: err_msg
            });
        });
};
