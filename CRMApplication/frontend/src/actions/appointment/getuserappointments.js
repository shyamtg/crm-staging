import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {
  APPOINTMENTS_FETCH_ERROR,
  APPOINTMENTS_LOADED,
  APPOINTMENTS_LOADING,
} from "../types";

export const getUserAppointments =  (
  start_time='', end_time='', filter_users=[], no_page=false) => (
  dispatch,
  getState
) => {
  dispatch({ type: APPOINTMENTS_LOADING });
  let apiUrl = "/appointments/"+
    "?start_time_after="+start_time+"&end_time_before="+end_time;
  if(filter_users.length > 0){
    apiUrl += "&filter_users="+filter_users;
  }
  if(no_page){
    apiUrl += "&no_page=true";
  }
   api
    .get(apiUrl,
      tokenConfig(getState))
    .then(res => {
      dispatch({
        type: APPOINTMENTS_LOADED,
        payload: no_page ? res.data : res.data.results
      });
    })
    .catch(err => {
      let err_msg = "";
      if (err.response.data !== 'object'){
        err_msg = "Something went wrong";
      }
      else if ("detail" in err.response.data) {
        err_msg = err.response.data.detail;
      } 
      else {
        for (var key in err.response.data) {
          err_msg += err.response.data[key];
        }
      }
      dispatch({
        type: APPOINTMENTS_FETCH_ERROR,
        payload: err_msg
      });
    });
};