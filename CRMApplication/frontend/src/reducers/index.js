import { combineReducers } from "redux";
import auth from "./accounts/usermanagement/auth";
import myProfile from "./accounts/myprofilemanagement/getprofile";
import myProfileUpdate from "./accounts/myprofilemanagement/updateprofile";
import createUser from "./accounts/usermanagement/createuser";
import updateUser from "./accounts/usermanagement/updateuser";
import fetchUser from "./accounts/usermanagement/fetchuser";
import getUsers from "./accounts/usermanagement/getusers";
import deleteUsers from "./accounts/usermanagement/deleteusers";
import loadUserPref from "./accounts/userpreference/loadpreference";
import updateUserPref from "./accounts/userpreference/updatepreference";
import getUserSlots from "./appointment/getuserslot";
import bookAppointment from "./appointment/bookappointment";
import userAppointments from "./appointment/getuserappointments";
import appointmentDetails from "./appointment/getappointmentdetails";
import updateAppointment from "./appointment/updateappointment";
import fetchSocialProfile from "./social/fetchsocialprofile";
import checksu from "./accounts/usermanagement/checksu";
import registerTeam from "./team/registerteam";
import getClients from "./accounts/usermanagement/getclients";
import createForm from "./forms/createform";
import updateForm from "./forms/updateform";
import deleteForm from "./forms/deleteform";
import fetchUserForms from "./forms/fetchuserforms";
import getFormsInputs from "./forms/getformsinputs";
import deleteFromInput from "./forms/deleteforminput";
import getFormInputDetails from "./forms/getforminputdetails";
import saveFormInput from "./forms/saveforminput";
import fetchFormDetails from "./forms/fetchformdetails"
import userLeadData from "./analytics/uservslead"
import common from "./common";

export default combineReducers({
  auth,
  myProfile,
  myProfileUpdate,
  common,
  createUser,
  updateUser,
  fetchUser,
  getUsers,
  deleteUsers,
  loadUserPref,
  updateUserPref,
  getUserSlots,
  bookAppointment,
  userAppointments,
  appointmentDetails,
  updateAppointment,
  fetchSocialProfile,
  checksu,
  registerTeam,
  getClients,
  createForm,
  fetchFormDetails,
  updateForm,
  deleteForm,
  fetchUserForms,
  getFormInputDetails,
  getFormsInputs,
  deleteFromInput,
  saveFormInput,
  userLeadData
});
