import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { message } from "antd";

import {
    REGISTER_TEAM_FAIL,
    REGISTER_TEAM_SUCCESS,
    RESET_TEAM_STATE,
    REGISTER_TEAM_LOADING
  } from "../types";

//Create new team

export const createTeam = teamdata => (dispatch, getState) => {
  teamdata["meta_data"] = {
    "desc": teamdata["desc"]
  }
  // teamdata["profile_pic"] = teamdata["profile_pic"]["file"]
  dispatch({ type: REGISTER_TEAM_LOADING });
  //const body = JSON.stringify(teamdata);
  const body = new FormData();
  body.set("team_name",teamdata["team_name"])
  body.append("profile_pic",teamdata["profile_pic"])
  let headers = tokenConfig(getState);
  headers["headers"]["Content-Type"] = "multipart/form-data";
  api
    .post("/teams/", body, tokenConfig(getState))
    .then(res => {
      message.success("Team created successfully");
      dispatch({
        type: REGISTER_TEAM_SUCCESS,
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
        type: REGISTER_TEAM_FAIL,
        payload: err_msg
      });
    });
};
