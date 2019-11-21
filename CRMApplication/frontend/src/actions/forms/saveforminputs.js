import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import { ac_getFormInput } from './getforminputs';
import {
    FORM_INPUT_SAVING,
    FORM_INPUT_ERROR,
    FORM_INPUT_SUCCESS
} from "../types";

export const ac_saveForm = (data, input_id = null) => (dispatch, getState) => {
    dispatch({ type: FORM_INPUT_SAVING });
    const body = JSON.stringify(data);
    //execute patch call if updating existing draft or post call to create a new draft
    if (input_id) {
        api
            .patch("/form_data/"+input_id.toString()+"/", body, tokenConfig(getState))
            .then(res => {
                message.success("Saved successfully");
                dispatch({
                    type: FORM_INPUT_SUCCESS,
                    payload: res.data
                });
                dispatch(ac_getFormInput(input_id.toString()));
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
                    type: FORM_INPUT_ERROR,
                    payload: err_msg
                });
            });
    }
    else {
        api
            .post("/form_data/", body, tokenConfig(getState))
            .then(res => {
                message.success("Saved successfully");
                dispatch({
                    type: FORM_INPUT_SUCCESS,
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
                    type: FORM_INPUT_ERROR,
                    payload: err_msg
                });
            });
    }
};
