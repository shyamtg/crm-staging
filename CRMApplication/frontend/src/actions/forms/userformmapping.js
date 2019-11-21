import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";
import {store} from "../../index";
import {getUsers} from "../accounts/usermanagement/fetchuser";
export const ac_mapuserform = (data) => {
    const body = JSON.stringify(data);
    api
        .post("/user_forms/",body, tokenConfig(store.getState))
        .then(res => {
            store.dispatch(getUsers({ 
                unmapped_users: true, 
                form_id: data.form, 
                page:1 
            }));
            message.success("User mapped successfully");
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
            message.error("Unable to map user "+err_msg);
        });
};

export const ac_unmapuserform = (userid, formid) =>  {
    api
        .delete("/user_forms/delete/?user_id="+userid.toString()+"&form_id="+formid.toString(), 
        tokenConfig(store.getState))
        .then(res => {
            store.dispatch(getUsers({ 
                mapped_users: true, 
                form_id: formid, 
                page:1 
            }));
            message.warning("User unmapped successfully");
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
            message.error("Unable to unmap user "+err_msg);
        });
};
