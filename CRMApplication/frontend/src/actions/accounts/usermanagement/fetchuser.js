import api from "../../../apiurl";
import {CancelToken} from "../../../apiurl";
import {qargsToQstring} from "../../common";
import { tokenConfig } from "./../usermanagement/auth";
import {
  USERDETAILS_LOADING,
  USERDETAILS_LOADED,
  USERDETAILS_ERROR,
  USERLIST_ERROR,
  USERLIST_LOADED,
  USERLIST_LOADING,
  USER_LOADED
} from "../../types";


// get user details
export const fetchUser = userid => (dispatch, getState) => {
  dispatch({ type: USERDETAILS_LOADING });
  api
    .get("/users/" + userid.toString() + "/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USERDETAILS_LOADED,
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
        type: USERDETAILS_ERROR,
        payload: err_msg
      });
    });
};


// fetchallusers
export const getUsers = (query_args={}) => (dispatch, getState) => {
  let query_string = qargsToQstring(query_args);
  let pageUrl = "/users/"+query_string;
  dispatch({ type: USERLIST_LOADING });
  var source = CancelToken.source();
  source.cancel('Operation canceled by the user.');
  api
    .get(pageUrl, tokenConfig(getState),{
      cancelToken: source.token
     })
    .then(res => {
      dispatch({
        type: USERLIST_LOADED,
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
        type: USERLIST_ERROR,
        payload: err_msg
      });
    });
   

};
