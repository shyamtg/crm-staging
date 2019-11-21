import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { createUser } from "../../actions/accounts/usermanagement/createuser";
import { loadUserProfile } from "../../actions/accounts/myprofilemanagement/getprofile";
import { updateProfile } from "../../actions/accounts/myprofilemanagement/updateprofile";
import {
  fetchUser,
  getUsers
} from "../../actions/accounts/usermanagement/fetchuser";
import {
  getClients
} from "../../actions/accounts/usermanagement/fetchclients";
import {
  updateUser
} from "../../actions/accounts/usermanagement/updateuser";
import { deleteUsers } from "../../actions/accounts/usermanagement/deleteusers";
import { reset } from "../../actions/common";
import { loadRoles } from "../../actions/common";
import UserPreferenceForm from "./userpreference";
import UserProfilePic from "./userprofilepic";
import DjangoCSRFToken from "django-react-csrftoken";
import { DATA_PER_PAGE, responsiveDrawerWidth, isMobile } from "../../actions/types";
import { Link } from "react-router-dom";
import {
  PageHeader,
  Modal,
  Pagination,
  Checkbox,
  Drawer,
  Tabs,
  Alert,
  Form,
  Icon,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Select,
  Avatar,
  List,
} from "antd";
import { height } from "@amcharts/amcharts4/.internal/core/utils/Utils";
const { Option } = Select;
const { TabPane } = Tabs;

export class ClientsList extends Component {
  componentWillMount() {

    this.props.getClients("", this.props.user_id);
  }
  state = {
    selectedUser: "",
    currentPage: 1
  };


  pageChange = e => {
    this.props.getClients(e);
    this.setState({ currentPage: e });
  };
  render() {
    return (
      <Fragment>
        {this.props.getClientsData.isLoading ? (
          <Spin tip="Loading..." />
        ) : (
            <Fragment>
              <List
                itemLayout="horizontal"
                dataSource={(this.props.getClientsData.clientsList) ? this.props.getClientsData.clientsList : []}
                renderItem={item => (
                  <List.Item

                    className="client-list"
                    actions={[]}
                  >
                    <List.Item.Meta

                      title={item.client_name}
                      description={item.client_email_id}
                    />
                  </List.Item>
                )}
              />
              {/* <Pagination
                hideOnSinglePage={true}
                current={this.state.currentPage}
                onChange={this.pageChange}
                defaultPageSize={DATA_PER_PAGE}
                total={this.props.getUsersData.count}
              /> */}
            </Fragment>
          )}
      </Fragment>
    );
  }
}

class UserDetailsFields extends React.Component {
  componentWillMount() {
    this.props.loadRoles();
  }

  state = {
    confirmDirty: false
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.groups = [1]; //by default have groups as 1 becuase all users will be mapped to basic package
      if (!err) {
        if (this.props.updateUserDetails) {
          this.props.updateUser(this.props.userData.id, values);
        } else if (this.props.updateUserProfile) {
          this.props.updateProfile(this.props.userData.id, values);
        } else {
          this.props.createUser(values);
        }
      }
    });
  };

  onChange = e => {
    this.setState(this.props.form.getFieldsValue());
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    let roleItems = this.props.role.roles
      ? this.props.role.roles.map(value => (
        <Option key={value.id} value={value.id}>
          {value.role_name}
        </Option>
      ))
      : null;
    return (
      <Fragment>
        {this.props.createUserData.isError ? (
          <Alert
            style={{ display: "inline-block" }}
            message="Registration Failed"
            description={this.props.createUserData.isError}
            type="error"
            closable
          />
        ) : null}
        {this.props.updateUserData.isUpdateError ? (
          <Alert
            style={{ display: "inline-block" }}
            message="Update Failed"
            description={this.props.updateUserData.isUpdateError}
            type="error"
            closable
          />
        ) : null}
        <Form onSubmit={this.handleSubmit} className="userdetails-form">
          <Form.Item label="Username">
            {getFieldDecorator("username", {
              initialValue: this.props.userData
                ? this.props.userData.username
                : null,
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          <Row gutter={16} type="flex">
            <Col xs={24} sm={16} md={12} lg={12}>
              <Form.Item label="First Name">
                {getFieldDecorator("first_name", {
                  initialValue: this.props.userData
                    ? this.props.userData.first_name
                    : null,
                  rules: [
                    {
                      required: true,
                      message: "Please input your firstname!"
                    }
                  ]
                })(<Input onChange={this.onChange} />)}
              </Form.Item>
            </Col>
            <Col xs={24} sm={16} md={12} lg={12}>
              <Form.Item label="Last Name">
                {getFieldDecorator("last_name", {
                  initialValue: this.props.userData
                    ? this.props.userData.last_name
                    : ""
                })(<Input onChange={this.onChange} />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="E-mail">
            {getFieldDecorator("email", {
              initialValue: this.props.userData
                ? this.props.userData.email
                : null,
              rules: [
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                },
                {
                  required: true,
                  message: "Please input your E-mail!"
                }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          {this.props.showPassword ? (
            <Fragment>
              <Form.Item label="Password" hasFeedback>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your password!"
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>
              <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator("confirm", {
                  rules: [
                    {
                      required: true,
                      message: "Please confirm your password!"
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
              </Form.Item>
            </Fragment>
          ) : null}
          <Form.Item label="Mobile Number">
            {getFieldDecorator("user_mobile_number", {
              initialValue: this.props.userData
                ? this.props.userData.user_mobile_number
                : null,
              rules: [
                {
                  required: true,
                  message: "Please input your mobile number!"
                }
              ]
            })(<Input onChange={this.onChange} />)}
          </Form.Item>
          <Form.Item label="Role">
            {getFieldDecorator("role", {
              initialValue: this.props.userData
                ? this.props.userData.team_role[0].role
                : null,
              rules: [{ required: true, message: "Please select Role!" }]
            })(
              <Select
                placeholder="Select Role"
                onChange={this.onChange}
                loading={this.props.role.isRolesLoading}
              >
                {roleItems}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {this.props.createUserData.isLoading ||
              this.props.updateUserData.isUpdating ? (
                <Button type="primary" loading>
                  Loading
              </Button>
              ) : (
                <Fragment>
                  <Button
                    style={{ display: "inline" }}
                    type="primary"
                    htmlType="submit"
                  >
                    {this.props.updateUserDetails ? "Save" : "Submit"}
                  </Button>
                </Fragment>
              )}
          </Form.Item>
          <DjangoCSRFToken />
        </Form>
      </Fragment>
    );
  }
}

export class AddUser extends Component {
  render() {
    return <UserDetailsApp loadUserDetails={false} showPassword={true} />;
  }
}

class UserProfile extends Component {
  state = {
    isEdit: true
  }
  constructor(props) {
    super(props);
    if (this.props.match.params.id) {
      this.props.fetchUser(this.props.match.params.id);
    }
  }
  render() {
    let userData = (this.props.match.params.id) ? this.props.fetchUserData : this.props.myProfile;
    return (
      <Fragment>
        <PageHeader className="page-header" />
        <div className="content-section">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Profile" key="1">
              <Row type="flex" align="middle">
                <Col xs={24} sm={24} md={18} lg={12}>
                  {userData.isLoading ? <Spin /> :
                    <Fragment>
                      <UserProfilePic userData={userData.user} />
                      <UserDetailsApp
                        userData={userData.user}
                        updateUserProfile={(this.props.match.params.id) ? false : true}
                        updateUserDetails={(this.props.match.params.id) ? true : false}
                        showPassword={false}
                      />
                    </Fragment>
                  }
                </Col>
              </Row>
            </TabPane>
            {this.props.hideUserPref ? null : (
              <TabPane tab="Preferences" key="2">
                <Row type="flex" align="middle">
                  <Col xs={24} sm={24} md={18} lg={12}>
                    {this.state.isEdit ? <UserPreferenceForm /> : <UserPreferenceForm />}
                  </Col>
                </Row>
              </TabPane>
            )}
            <TabPane tab="Clients" key="3">
              <Row type="flex" align="middle">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <ClientListApp user_id={this.props.match.params.id ? this.props.match.params.id : ""} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

export class UserList extends Component {
  /*
  To get the list of users in the team
  this.props.getUsers - action creator to fetch users list
  this.props.fetchUser - action crator used to fetch a user details
  this.props.querystring - is passed from parent component to fetch different set of user data
  this.props.singleSelect - is passed from parent component to enable single selection in user list
  this.props.getSelectedUsers - is passed from parent component to send the selected user list
  this.props.onUserSelectionChange - is passed from parent componen to track the change is user selection
  this.props.showSmallWindow - is passed from parent component to show the userlist component in small size
  this.props.hideActions - is passed from parent component to hide the view, edit etc,. actions
   */
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedUserList: [],
      selectedUserNameList:[],
      currentPage: 1
    };
    /* check if any parent component passes the querystring.
    querystring will be used to fetch different set of user data */
    this.props.getUsers(this.props.querystring ? 
      Object.assign(this.props.querystring, { page: this.state.currentPage }) : 
      { page: this.state.currentPage });
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  editUser = (userid, e) => {
    this.showDrawer();
    this.props.fetchUser(userid);
  };
  pageChange = e => {
    this.props.getUsers(this.props.querystring ? 
      Object.assign(this.props.querystring, { page: e }) : 
      { page: e });
    this.setState({ currentPage: e });
  };
  loadUserList = () => {
    this.onClose();
  };
  onUserselect = (e, userid, username) => {
    let ul = this.state.selectedUserList;
    let ul_name = this.state.selectedUserNameList;
    if (e.target.checked) {
      if(this.props.singleSelect){
        ul = [userid];
        ul_name = [username]
      }
      else{
        ul.push(userid);
        ul_name.push(username);
      }
    } else {
      ul.splice(ul.indexOf(userid), 1);
      ul_name.splice(ul_name.indexOf(username), 1);
    }
    this.setState({ selectedUserList: ul, selectedUserNameList:ul_name }, () => { 
      if (this.props.getSelectedUsers) {
        this.props.getSelectedUsers(this.state.selectedUserList);
      } 
      if(this.props.getSelectedUsernames){
        this.props.getSelectedUsernames(this.state.selectedUserNameList);
      }
    });
    
  };

  searchUsers = (e) => {
    this.props.getUsers(this.props.querystring ? 
      Object.assign(this.props.querystring, { q: e.target.value, page: 1 }) : 
      { q: e.target.value, page: 1 });
  }
  onUserSelectionChange = (e) => {
    if(this.props.onUserSelectionChange){
      this.props.onUserSelectionChange(e.target);
    }
  }

  render() {
    const SmallWindow = {
      width:'300px',
      height:'500px',
      overflow:'auto'
    }
    const avatar_color_list = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    let avatar_color_list_idx = 0;
    return (
      <div style={this.props.showSmallWindow ? SmallWindow: {}}>
        <Row>
          <Col xs={24} sm={24} md={18} lg={12}>
            <Input size="large" onChange={this.searchUsers} placeholder="Search users" />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            {this.props.getUsersData.isLoading ? (
              <Spin tip="Loading..." />
            ) : (
                <Fragment>
                  <List
                    itemLayout="horizontal"
                    dataSource={(this.props.getUsersData.userlist) ? this.props.getUsersData.userlist : []}
                    renderItem={(item) => (
                      <List.Item data-color={avatar_color_list_idx = (avatar_color_list_idx >= avatar_color_list.length - 1) ? 0 : avatar_color_list_idx + 1}

                        className="user-list"
                        actions={this.props.hideActions ? [] : [<Link to={"/profile/" + item.id.toString()}><Icon type="eye" /> View</Link>, <Button type="link" onClick={e => { e.preventDefault(); e.stopPropagation(); this.editUser(item.id, e); }} icon="edit">Edit</Button>]}
                      >
                        <List.Item.Meta

                          avatar={
                            (item.profile_pic) ?
                              <Avatar
                                size="large"
                                src={item.profile_pic} /> :
                              <Avatar
                                style={{ backgroundColor: avatar_color_list[avatar_color_list_idx] }}
                                size="large"
                                icon="user" />
                          }
                          title={
                            <Checkbox
                              onChange={this.onUserSelectionChange}
                              value={item.id}
                              checked={
                                this.state.selectedUserList.indexOf(item.id) < 0
                                  ? false
                                  : true
                              }
                              onClick={e => this.onUserselect(e, item.id, item.username)}
                            >
                              {item.first_name} {item.last_name}
                            </Checkbox>}
                          description={item.email}
                        />
                      </List.Item>
                    )}
                  />
                  <Pagination
                    hideOnSinglePage={true}
                    current={this.state.currentPage}
                    onChange={this.pageChange}
                    defaultPageSize={DATA_PER_PAGE}
                    total={this.props.getUsersData.count}
                  />
                  <Drawer
                    width={responsiveDrawerWidth}
                    title="Update user"
                    onClose={this.onClose}
                    visible={this.state.visible}
                    destroyOnClose={true}
                  >
                    {this.props.fetchUserData.isLoading ? (
                      <Spin tip="Loading..." />
                    ) : (
                        <UserDetailsApp
                          userData={this.props.fetchUserData.user}
                          updateUserDetails={true}
                          showPassword={false}
                        />
                      )}
                  </Drawer>
                </Fragment>
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

class Users extends Component {
  state = {
    drawerVisible: false,
    selectedUserList: [],
    errorModalVisible: false
  };
  showDrawer = () => {
    this.setState({
      drawerVisible: true
    });
  };
  onClose = () => {
    this.setState({
      drawerVisible: false
    });
  };

  onDelete = () => {
    this.props.deleteUsers(this.state.selectedUserList);
  };

  getSelectedUsers = userList => {
    this.setState({ selectedUserList: userList });
  };

  showDeleteConfirm = ele => {
    Modal.confirm({
      title: "Are you sure delete user(s)?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        ele.onDelete();
      }
    });
  };

  handleOk = () => {
    Modal.destroyAll();
    this.setState({ errorModalVisible: false });
  };
  render() {
    return (
      <Fragment>

        {this.props.deleteUsersData.isDeleting ? (
          <Fragment>
            <Modal
              title="Info"
              okButtonProps={{ hidden: true }}
              cancelButtonProps={{ hidden: true }}
              visible={true}
            >
              Deleting...
            </Modal>
          </Fragment>
        ) : null}
        {this.props.deleteUsersData.isDeleteError ? (
          <Fragment>
            <Alert
              message={this.props.deleteUsersData.isDeleteError}
              closable
              type="error"
            />
          </Fragment>
        ) : null}

        <PageHeader className="align-right page-header">
          <Button onClick={this.showDrawer} type="link">
            <Icon type="plus" /> <b>Add User</b>
          </Button>
          <Button
            onClick={e => this.showDeleteConfirm(this)}
            type="link"
            icon="delete"
          >
            <b>Delete</b>
          </Button>
        </PageHeader>
        <Row className="content-section">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Drawer
              width={responsiveDrawerWidth}
              title="Create a new account"
              onClose={this.onClose}
              visible={this.state.drawerVisible}
              destroyOnClose={true}
            >
              <AddUser />
            </Drawer>
            <UserListApp getSelectedUsers={this.getSelectedUsers} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  createUserData: state.createUser,
  updateUserData: state.updateUser,
  role: state.common,
  auth: state.auth,
  myProfile: state.myProfile
});

const UserDetailsForm = Form.create({ name: "UserDetails" })(UserDetailsFields);
const UserDetailsApp = connect(
  mapStateToProps,
  {
    createUser,
    loadRoles,
    fetchUser,
    getUsers,
    updateUser,
    updateProfile,
    reset
  }
)(UserDetailsForm);

const mapStateToPropsUserList = state => ({
  getUsersData: state.getUsers,
  fetchUserData: state.fetchUser
});
export const UserListApp = connect(
  mapStateToPropsUserList,
  { getUsers, fetchUser }
)(UserList);

const mapStateToPropsClientList = state => ({
  getClientsData: state.getClients
});
const ClientListApp = connect(
  mapStateToPropsClientList,
  { getClients }
)(ClientsList);

const mapStateToPropsUserProfile = state => ({
  auth: state.auth,
  myProfile: state.myProfile,
  fetchUserData: state.fetchUser
});
export const UserProfileApp = connect(
  mapStateToPropsUserProfile,
  { loadUserProfile, fetchUser }
)(UserProfile);

const mapStateToPropsUsers = state => ({
  deleteUsersData: state.deleteUsers
});
export default connect(
  mapStateToPropsUsers,
  { deleteUsers }
)(Users);
