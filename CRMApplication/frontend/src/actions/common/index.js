import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { ROLES_LOADING, ROLES_LOADED, ROLES_ERROR, TIME_ZONE_LOADED, TIME_ZONE_LOADING } from "../types";

// GET USER teamroles
export const loadRoles = () => (dispatch, getState) => {
  dispatch({ type: ROLES_LOADING });
  api
    .get("/team_role/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ROLES_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: ROLES_ERROR
      });
    });
};

export const reset = (RESET) =>{
  return {
    type: RESET
  }
}

// GET Timezone
export const loadTimezones = () => (dispatch, getState) => {
  dispatch({ type: TIME_ZONE_LOADING });
  api
    .get("/timezones/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: TIME_ZONE_LOADED,
        payload: res.data.data
      });
    });
};

export const qargsToQstring = (query_args={}) => {
  let query_string = '';
  let idx =0;
  for (var key in query_args) {
    if (idx == 0){
      query_string += "?"+key+"="+query_args[key];
    }
    else{
      query_string += "&"+key+"="+query_args[key];
    }
    idx++;
  }
  return query_string;
}
