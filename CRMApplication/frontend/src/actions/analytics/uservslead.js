import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {qargsToQstring} from "../common";
import {
    ANA_USER_LEAD_ERROR,
    ANA_USER_LEAD_LOADING,
    ANA_USER_LEAD_SUCCESS,
} from "../types";

export const ac_uservslead = (query_args={}) => (dispatch, getState) => {
    let query_string = qargsToQstring(query_args);
    dispatch({ type: ANA_USER_LEAD_LOADING });
    //const body = JSON.stringify(data);
    api
        .get("/uservsleadstatus/"+query_string, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ANA_USER_LEAD_SUCCESS,
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
                type: ANA_USER_LEAD_ERROR,
                payload: err_msg
            });
        });
};
