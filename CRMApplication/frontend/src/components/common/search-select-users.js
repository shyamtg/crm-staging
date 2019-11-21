import React, { Fragment } from "react";
import { connect } from "react-redux";
import api from "../../apiurl";
import { Select, Spin, Empty, Popover, Button } from 'antd';
import querystring from 'querystring';
import { tokenConfig } from "./../../actions/accounts/usermanagement/auth";
import { store } from '../../index.js';
import { UserListApp } from "../users/user";

const { Option } = Select;

let timeout;

function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    //currentValue = value;

    function fake() {
        const str = querystring.encode({
            code: 'utf-8',
            q: value,
        });
        api
            .get(`http://127.0.0.1:8000/api/v1/users/?${str}`, tokenConfig(store.getState))
            .then(res => {
                const data = [];
                res.data.results.forEach(r => {
                    data.push({
                        value: r["username"],
                        text: r["username"],
                    });
                });
                callback(data);
            });
    }

    timeout = setTimeout(fake, 300);
}

export class SearchSelectUsers extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        if (this.props.selectedUser) {
            this.setState({ value: this.props.selectedUser });
        }
    }
    getSelectedUsers = (user) => {
        if (this.props.getSelectedUser) {
            this.props.getSelectedUser(user);
        }
    }
    getSelectedUsernames = (user) => {
        if (this.props.getSelectedUsernames) {
            this.props.getSelectedUsernames(user);
        }
    }
    render() {
        return (
            <Popover
                trigger="click" content={
                    <UserListApp
                        getSelectedUsers={this.getSelectedUsers}
                        getSelectedUsernames = {this.getSelectedUsernames}
                        showSmallWindow={true}
                        hideActions={true}
                        singleSelect={this.props.multiSelect ? false : true}
                    />}
                title="Select User">
                <Button>Click to filter users</Button>
            </Popover>
        );
    }
}