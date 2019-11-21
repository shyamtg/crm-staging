import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import {
    CREATE_FORM_LOADING,
    CREATE_FORM_ERROR,
    CREATE_FORM_SUCCESS,
} from "../types";

export const ac_createForm = data => (dispatch, getState) => {

    dispatch({ type: CREATE_FORM_LOADING });
    const body = JSON.stringify(data);
    api
        .post("/forms/", body, tokenConfig(getState))
        .then(res => {
            message.success("Form created successfully");
            dispatch({
                type: CREATE_FORM_SUCCESS,
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
                type: CREATE_FORM_ERROR,
                payload: err_msg
            });
        });
};
