import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import {
    UPDATE_FORM_ERROR,
    UPDATE_FORM_LOADING,
    UPDATE_FORM_SUCCESS,
} from "../types";

export const ac_updateForm = (id, data) => (dispatch, getState) => {
    dispatch({ type: UPDATE_FORM_LOADING });
    const body = JSON.stringify(data);
    api
        .patch("/forms/"+id.toString()+"/", body, tokenConfig(getState))
        .then(res => {
            message.success("Form updated successfully");
            dispatch({
                type: UPDATE_FORM_SUCCESS,
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
                type: UPDATE_FORM_ERROR,
                payload: err_msg
            });
        });
};
