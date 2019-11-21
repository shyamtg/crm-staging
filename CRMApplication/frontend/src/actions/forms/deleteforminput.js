import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import {
    DELETE_FORM_INPUT_LOADING,
    DELETE_FORM_INPUT_ERROR,
    DELETE_FORM_INPUT_SUCCESS,
    FORMS_INPUTS_DELETED
} from "../types";

export const ac_deleteFormInput = input_id => (dispatch, getState) => {
    dispatch({ type: DELETE_FORM_INPUT_LOADING });
    api
        .delete("/form_data/"+input_id.toString()+"/", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_FORM_INPUT_SUCCESS
            });
            dispatch({
                type: FORMS_INPUTS_DELETED,
                payload:input_id
            });
            message.success("Deleted successfully");
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
                type: DELETE_FORM_INPUT_ERROR,
                payload: err_msg
            });
        });
};
