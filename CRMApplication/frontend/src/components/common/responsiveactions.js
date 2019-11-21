import React, { Fragment } from "react";
import { connect } from "react-redux";
import { isMobile } from "../../actions/types";
import {
    Menu,
    Dropdown,
    Button,
    Icon
} from "antd";
// ResponsiveActions component is used to display set of components as a dropdown menu item
// props:
//     controls  : list of items
//     controlsname : name to display on the dropdown button
export class ResponsiveActions extends React.Component {
    render() {

        let menu = this.props.controls
            ? this.props.controls.map((item,idx) => (
                <Menu.Item key={idx}>
                    {item}
                </Menu.Item>
            ))
            : '';
        menu = <Menu>{menu}</Menu>
        return (
            <Dropdown overlay={menu}>
                <Button>
                    {this.props.controlsname ? this.props.controlsname : 'More'} <Icon type="down" />
                </Button>
            </Dropdown>
        );
    }
}

export default ResponsiveActions