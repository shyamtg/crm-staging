import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import {
    DELETE_FORM_ERROR,
    DELETE_FORM_LOADING,
    DELETE_FORM_SUCCESS,
    USER_FORMS_DELETED
} from "../types";

export const ac_deleteForm = formid => (dispatch, getState) => {
    dispatch({ type: DELETE_FORM_LOADING });
    api
        .delete("/forms/"+formid.toString()+"/", tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_FORM_SUCCESS
            });
            dispatch({
                type: USER_FORMS_DELETED,
                payload:formid
            });
            message.success("Form deleted successfully");
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
                type: DELETE_FORM_ERROR,
                payload: err_msg
            });
        });
};
