import api from "../../../apiurl";
import { tokenConfig } from "../../accounts/usermanagement/auth";
import {
  VALIDATING_SU,
  VALIDATED_SU
} from "../../types";
import { nonsense } from "antd-mobile/lib/picker";

export const ac_checksu =  () => (
    dispatch,
    getState
  ) => {
    dispatch({
      type: VALIDATING_SU
    });
    api
    .get(
      "/issu/",
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: VALIDATED_SU,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: VALIDATED_SU,
        payload: false
      });
    });
  }