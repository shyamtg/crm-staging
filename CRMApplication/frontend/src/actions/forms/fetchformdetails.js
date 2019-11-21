import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {
    FORM_DETAILS_ERROR,
    FORM_DETAILS_LOADING,
    FORM_DETAILS_SUCCESS
} from "../types";

export const ac_fetchFormDetails = id => (dispatch, getState) => {

    dispatch({ type: FORM_DETAILS_LOADING });
    api
        .get("/forms/"+id.toString()+"/", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: FORM_DETAILS_SUCCESS,
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
                type: FORM_DETAILS_ERROR,
                payload: err_msg
            });
        });
};
