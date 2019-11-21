import api from "../../../apiurl";
import { tokenConfig } from "./../usermanagement/auth";
import {
    CLIENTLIST_ERROR,
    CLIENTLIST_LOADED,
    CLIENTLIST_LOADING,
} from "../../types";


// fetch all clients
export const getClients = (pagenumber = "", userData="") => (dispatch, getState) => {
  console.log(userData);
  let pageUrl = pagenumber && userData
    ? "/clients/?page=" + pagenumber.toString() + "&user=" + userData.toString() :
    pagenumber ? "/clients/?page=" + pagenumber.toString() : userData ? "/clients/?user=" + userData.toString() : "/clients/";
  dispatch({ type: CLIENTLIST_LOADING });
  api
    .get(pageUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: CLIENTLIST_LOADED,
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
        type: CLIENTLIST_ERROR,
        payload: err_msg
      });
    });
};
