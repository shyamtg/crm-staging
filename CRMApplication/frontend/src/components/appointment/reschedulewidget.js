import React, { Fragment } from "react";
import { connect } from "react-redux";
import { reset } from "../../actions/common";
import { getAppointmentDetails } from "../../actions/appointment/getappointmentdetails";
import { updateappointment } from "../../actions/appointment/updateappointment";
import { Redirect } from "react-router-dom";
import {
  RESET_UPDATE_APPOINTMENT_STATE,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TIME_FORMAT_AM_PM,
} from "../../actions/types";
import {
  Empty,
  Spin,
  message
} from "antd";
import {URL_APP_INFO} from "../common/url";
import BookingWidget from './bookingwidget';
import moment from "moment";
class Reschedule extends React.Component {
  constructor(props) {
    super(props);
    this.props.getAppointmentDetails(this.props.match.params.id);
  }
  componentWillUnmount(){
    this.props.reset(RESET_UPDATE_APPOINTMENT_STATE);
  }
  rescheduleAppointment = () => {
    let slotInfo = this.props.userSlots;
    if (slotInfo.selectedDate && slotInfo.selectedTime) {
      let start_time = moment(
        slotInfo.selectedDate +
        " " +
        moment(slotInfo.selectedTime, ["h:mm A"]).format("HH:mm")
      ).format(DATE_TIME_FORMAT);
      let end_time = moment(start_time).add(
        slotInfo.slot_duration,
        "minutes"
      );
      end_time = end_time.format(
        DATE_TIME_FORMAT
      );
      let user = slotInfo.user;
      let timezone_field = slotInfo.timezone;
      let data = {  start_time, end_time, user, timezone_field };
      this.props.updateappointment(this.props.appointmentDetails.appointment.id, data);
    }
    else {
      message.error("Please select date and time");
    }

  }
  render() {
    let apptDetails = this.props.appointmentDetails;
    if (this.props.updateAppointment.isupdated) {
      return <Redirect to={URL_APP_INFO} />;
    }
    return (
      apptDetails.isError ?
        <Empty description={apptDetails.isError} /> :
        <Fragment>
          {apptDetails.isLoading ? <Spin tip="Loading..." /> :
            (!apptDetails.appointment) ?
              <Empty /> :
              <Fragment>
                <BookingWidget reschedule={true} handleReschedule={this.rescheduleAppointment} apptDate={moment(apptDetails.appointment.start_time).format(DATE_FORMAT)} apptTime={moment(apptDetails.appointment.start_time).format(TIME_FORMAT_AM_PM)} apptUser={apptDetails.appointment.user.username} apptduration={apptDetails.appointment.slot_duration} />

              </Fragment>
          }
        </Fragment>
    );

  }

}

const mapStateToProps = state => ({
  appointmentDetails: state.appointmentDetails,
  updateAppointment: state.updateAppointment,
  userSlots: state.getUserSlots,
  auth: state.auth
});
export default connect(mapStateToProps, { getAppointmentDetails, updateappointment, reset })(Reschedule)