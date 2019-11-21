import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./sidebar";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./dashboard";
import CalendarApp from "./appointment/calendar";
import BookingWidget from "./appointment/bookingwidget";
import UserAppointments from "./appointment/showappointments";
import AppointmentDetails from "./appointment/appointmentdetails";
import Reschedule from "./appointment/reschedulewidget";
import infoPage from "./appointment/appointmentinfo";
import GetSocialProfile from "./social/fetchsocialprofile";
import Users from "./users/user";
import Login from "./login";
import CreateTeam from "./team/createteam";
import Forms from "./forms/formsdashboard";
import EditForm from "./forms/editform";
import ViewForm from "./forms/viewform";
import AnalyticsDashboard from "./analytics/analyticsDashboard";
import { updateUserPreference } from "../actions/accounts/userpreference/updatepreference";
import { getUserPreference } from "../actions/accounts/userpreference/loadpreference";
import { UserProfileApp } from "./users/user";
import { logout } from "../actions/accounts/usermanagement/auth";
import { loadUserProfile } from "../actions/accounts/myprofilemanagement/getprofile";
import { Link } from "react-router-dom";
import * as URL from "../components/common/url"
import {
  Menu,
  Dropdown,
  Layout,
  Row,
  Col,
  Icon,
  Button,
  Form,
  Avatar,
  Switch
} from "antd";
const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    //validate the token of authenticated user
    if (this.props.auth.isAuthenticated) {
      this.props.loadUserProfile();
      this.props.getUserPreference();
    }
  }
  handleSwitchChange = e => {
    this.props.updateUserPreference(
      this.props.loadUserPref.user_preference.id,
      { flag_view_as_team: e }
    );
  };
  componentDidUpdate(prevProps) {
    if (this.props.loadUserPref.user_preference && prevProps.loadUserPref.user_preference) {
      if (this.props.loadUserPref.user_preference.flag_view_as_team != prevProps.loadUserPref.user_preference.flag_view_as_team){
        window.location.reload();
      }
    }
  }
    render() {
      const LoginFrom = Form.create({ name: "Login" })(Login);
      const menu = (
        <Menu>
          <Menu.Item key="0">
            <Link icon="user" to="/profile">
              <Button type="link" icon="user">
                Profile
            </Button>
            </Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="1">
            <Button type="link" onClick={this.props.logout} icon="poweroff">
              Logout
          </Button>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="2">
            <Switch
              defaultChecked={
                this.props.loadUserPref.user_preference
                  ? this.props.loadUserPref.user_preference.flag_view_as_team
                  : false
              }
              size="small"
              name="flag_view_as_team"
              onClick={this.handleSwitchChange}
            />
            <label className="coloured-text"> View as Team</label>
          </Menu.Item>
        </Menu>
      );
      return (
        <BrowserRouter>
          <Layout style={{ minHeight: "100vh" }}>
            {/* display navbar only for authenticated users */}
            {this.props.auth.isAuthenticated && this.props.myProfile.user ? (
              <Navbar />
            ) : null}
            <Layout>
              {/* display headers only for authenticated users */}
              {this.props.auth.isAuthenticated && this.props.myProfile.user ? (
                <Header style={{ backgroundColor: "#fff" }}>
                  <Row type="flex">
                    <Col span={24}>
                      <div className="align-right">
                        <Dropdown overlay={menu} trigger={["click"]}>
                          <Link
                            style={{ fontWeight: "bold" }}
                            className="ant-dropdown-link"
                            to="/"
                          >
                            <Avatar
                              style={{
                                marginRight: "5px",
                                backgroundColor: "#1890ff"
                              }}
                              icon="user"
                            />
                            Hello,{" "}
                            {this.props.myProfile.user
                              ? this.props.myProfile.user.first_name
                              : ""}{" "}
                            <Icon type="down" />
                          </Link>
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                </Header>
              ) : null}
              <Content className="container">
                <PrivateRoute exact path="/" component={Dashboard} />
                <Route path="/login" component={LoginFrom} />
                <PrivateRoute path="/createteam" component={CreateTeam} />
                <PrivateRoute exact path="/profile" component={UserProfileApp} />
                <PrivateRoute
                  path="/profile/:id(\d+)"
                  component={UserProfileApp}
                />
                <PrivateRoute path="/users" component={Users} />
                <PrivateRoute path="/calendar" component={CalendarApp} />
                <PrivateRoute path="/fetchsocial" component={GetSocialProfile} />
                <PrivateRoute exact path={URL.URL_FORMS} component={Forms} />
                <PrivateRoute
                  path={URL.URL_FORMS + "/:id(\\d+)"}
                  component={ViewForm}
                />
                <PrivateRoute
                  path={URL.URL_FORMS_EDIT + "/:id(\\d+)"}
                  component={EditForm}
                />
                <PrivateRoute
                  exact
                  path={URL.URL_APPOINTMENTS}
                  component={UserAppointments}
                />
                <PrivateRoute
                  path={URL.URL_APPOINTMENTS + "/:id(\\d+)"}
                  component={AppointmentDetails}
                />
                <Route
                  path={URL.URL_APPOINTMENTS + "/book"}
                  component={BookingWidget}
                />
                <Route path={URL.URL_APP_INFO} component={infoPage} />
                <Route
                  path={URL.URL_APP_RESCHEDULE + "/:id(\\d+)"}
                  component={Reschedule}
                />
                <PrivateRoute path="/analytics" component={AnalyticsDashboard} />
              </Content>
              <Footer style={{ textAlign: "center" }}>Baylynmedia</Footer>
            </Layout>
          </Layout>
        </BrowserRouter>
      );
    }
  }

  const mapStateToProps = state => ({
    auth: state.auth,
    myProfile: state.myProfile,
    re_updateUserPref: state.updateUserPref,
    loadUserPref: state.loadUserPref
  });
  export default connect(mapStateToProps, {
    logout,
    loadUserProfile,
    updateUserPreference,
    getUserPreference
  })(App);
