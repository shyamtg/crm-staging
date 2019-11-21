import {store} from "../../index";
import { ADMIN_ROLE } from "../../actions/types";

export const querystring = function getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
    var string = reg.exec(href);
    return string ? string[1] : null;
}

export const isAdmin = () =>{
  try{
    return store.getState().myProfile.user.team_role[0].role_name == ADMIN_ROLE;
  }
  catch(err){
    return false;
  }
} 