import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  DatePicker,
  Form,
  Row,
  Col,
  Button,
  Icon,
  Drawer,
} from "antd";
import { getUserAppointments } from "../../actions/appointment/getuserappointments";
import moment from "moment";
import { DATE_FORMAT, isMobile, YEAR_MONTH_FORMAT } from "../../actions/types";
import { SearchSelectUsers } from "../common/search-select-users";
import { isAdmin } from "../common/utils";

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export class FilterUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilterDrawerVisible: false
    };
  }
  showDrawer = () => {
    this.setState({ isFilterDrawerVisible: true });
  };

  onClose = () => {
    this.setState({ isFilterDrawerVisible: false });
  };

  render() {
    return (
      <Fragment>
        {isMobile ? (
          <Fragment>
            <Row className="align-right">
              <Col>
                {" "}
                <Button
                  type="primary"
                  onClick={this.showDrawer}
                  style={{ marginBottom: "15px" }}
                >
                  <Icon type="filter" />
                  Show Filters
                </Button>
              </Col>
            </Row>
            <Row className="align-right">
              <Col>
                <Drawer
                  onClose={this.onClose}
                  visible={this.state.isFilterDrawerVisible}
                >
                  {this.props.children}
                </Drawer>
              </Col>
            </Row>
          </Fragment>
        ) : (
            this.props.children
          )}
      </Fragment>
    );
  }
}

class FilterAppointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: this.props.userDetails,
      selectedUsers: [],
      start_date: moment(new Date()).format(DATE_FORMAT),
      end_date:
        moment().format(YEAR_MONTH_FORMAT) + "-" + moment().daysInMonth(),
      flag_team_appointments: false
    }

    this.props.getUserAppointments(
      this.state.start_date,
      this.state.end_date,
      this.state.selectedUsers
    )
  }

  handleFilter = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getUserAppointments(
          moment(values.start_date).format(DATE_FORMAT),
          moment(values.end_date).format(DATE_FORMAT),
          this.state.selectedUsers
        );
      }
    });
  };

  getSelectedUser = (users) => {
    this.setState({ selectedUsers: users });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };

    return (
      <Fragment>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} className="filter-form-item">
            <Form
              layout="inline"
              className="filterappoinments-form"
              onSubmit={this.handleFilter}>
              <Form.Item {...formItemLayout} label="From" htmlFor="start_date">
                {getFieldDecorator("start_date", {
                  rules: [{ required: false, message: "Please select time!" }],
                  initialValue: moment(this.state.start_date, DATE_FORMAT)
                  // initialValue: moment(this.props.start_date, DATE_FORMAT)
                })(<DatePicker />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="To" htmlFor="end_date">
                {getFieldDecorator("end_date", {
                  rules: [{ required: false, message: "Please select time!" }],
                  initialValue: moment(this.state.end_date, DATE_FORMAT)
                  // initialValue: moment(this.props.end_date, DATE_FORMAT)
                })(<DatePicker />)}
              </Form.Item>
              {isAdmin() ?
                <Form.Item>
                  <SearchSelectUsers getSelectedUser={this.getSelectedUser} multiSelect={true} />
                </Form.Item> : null}

              <Form.Item {...formItemLayout}>
                <Button type="primary" htmlType="submit">
                  <Icon type="filter" />
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userAppointments: state.userAppointments,
  userDetails: state.myProfile
});
const FilterAppointmentsApp = connect(
  mapStateToProps,
  { getUserAppointments }
)(FilterAppointments);
const FilterAppointmentsForm = Form.create({ name: "AppointmentsFilterForm" })(
  FilterAppointmentsApp
);
export default FilterAppointmentsForm;
