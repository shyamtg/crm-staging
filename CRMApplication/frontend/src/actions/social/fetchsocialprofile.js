import api from '../../apiurl'
import { tokenConfig } from "./../accounts/usermanagement/auth";
import {
    SEARCHED_SOCIAL_PROFILE,
    SEARCHING_SOCIAL_PROFILE,
    SEARCH_SOCIAL_PROFILE_ERROR
  } from "../../actions/types";
export const fetchsocialprofile_email = (email) => (dispatch, getState) => {
    dispatch({ type: SEARCHING_SOCIAL_PROFILE });
    const body = JSON.stringify({'email':email});
    api.post("/search_email/", body, tokenConfig(getState))
    .then(res => {
        console.log(res.data)
        dispatch({
            type: SEARCHED_SOCIAL_PROFILE,
            payload: res.data
        });
    })
    .catch(err => {
        //message.error(err.response.data.details,10);
        //dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: SEARCH_SOCIAL_PROFILE_ERROR
        });
    });
};
