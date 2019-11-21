import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getUserAppointments } from "../../actions/appointment/getuserappointments";
import {
  DATA_PER_PAGE,
  DATE_TIME_FORMAT_AM_PM,
} from "../../actions/types";
import FilterAppointmentsForm from "./filterappointments";
import { FilterUI } from "./filterappointments";
import {
  Descriptions,
  PageHeader,
  Pagination,
  Row,
  Col,
  Icon,
  Empty,
  List,
  Avatar
} from "antd";
import {URL_APPOINTMENTS} from "../common/url"
import { Link } from "react-router-dom";
import moment from "moment";

class UserAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentPage: 1,
    };
  }
  render() {
    const avatar_color_list = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    let avatar_color_list_idx = 0;
    return (
      <Fragment>
        <PageHeader className="align-right page-header"></PageHeader>
        <FilterUI>
          <FilterAppointmentsForm />
        </FilterUI>
        <Row className="content-section">
          <Col xs={24} sm={24} md={24} lg={24}>
            <List
              itemLayout="horizontal"
              dataSource={(this.props.userAppointments && this.props.userAppointments.appointments) ? this.props.userAppointments.appointments : []}
              renderItem={(item) => (
                <List.Item
                  data-color={avatar_color_list_idx = (avatar_color_list_idx >= avatar_color_list.length - 1) ? 0 : avatar_color_list_idx + 1}
                  className="appointment-list"
                  actions={
                    [
                      <Link to={URL_APPOINTMENTS+"/"+item.id.toString()}><Icon type="eye" /> View</Link>,
                    ]
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar
                      style={{ fontWeight:'bold', backgroundColor: avatar_color_list[avatar_color_list_idx] }}
                      size="large">{item.slot_duration + " min."}
                    </Avatar>}
                    title={item.user.first_name}
                    description={"with " + item.client.client_name + " @ " + moment(item.start_time).format(DATE_TIME_FORMAT_AM_PM)}
                  />
                </List.Item>
              )}
            />
            <Pagination
              hideOnSinglePage={true}
              defaultCurrent={this.state.currentPage}
              onChange={this.pageChange}
              defaultPageSize={DATA_PER_PAGE}
              total={10}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  userAppointments: state.userAppointments,
});
export default connect(
  mapStateToProps,
  { getUserAppointments }
)(UserAppointments);
