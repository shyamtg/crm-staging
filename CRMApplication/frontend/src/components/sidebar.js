import React, { Component } from "react";
import { Fragment } from "react";
import { Menu, Layout, Button, Icon, Drawer } from "antd";
import { Redirect, Link } from "react-router-dom";
import { isAdmin } from "./common/utils";
import { responsiveDrawerWidth, isMobile } from "../actions/types";

const { Sider } = Layout;

class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false }
  }

  render() {
    return (
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1">
          <Icon type="dashboard" />
          <span>Dashboard</span>
          <Link to="/" />
        </Menu.Item>
        {isAdmin() ?
          <Menu.Item key="2">
            <Icon type="user" />
            <span>Users</span>
            <Link to="/users" />
          </Menu.Item>
          : null}
        <Menu.Item key="3">
          <Icon type="calendar" />
          <span>Calendar</span>
          <Link to="/calendar" />
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="unordered-list" />
          <span>Appointments</span>
          <Link to="/appointments" />
        </Menu.Item>
        <Menu.Item key="5">
          <Icon type="form" />
          <span>Forms</span>
          <Link to="/forms" />
        </Menu.Item>
      </Menu>
    );
  }
}
class Navbar extends Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.goToHome.bind(this);
  }
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  goToHome = () => {
    return <Redirect to="/" />;
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  }
  render() {
    return (
      isMobile ?
        <Fragment>
          <Button
            type="primary"
            icon ="menu"
            onClick={this.showDrawer}
            className="menu-ham-icon"
          />
          <Drawer
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <Fragment>
                <div onClick={this.goToHome} className="logo" />
                <MenuItems />
              </Fragment>
            </Sider>
          </Drawer>
        </Fragment>
        :
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <Fragment>
            <Icon
              className="menu-icon trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <div onClick={this.goToHome} className="logo" />
            <MenuItems />
          </Fragment>
        </Sider>
    );
  }
}

export default Navbar;
