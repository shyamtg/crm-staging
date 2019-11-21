import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
    PageHeader,
    Button,
    Drawer,
    Row,
    Col
} from "antd";
import ResponsiveActions from "../common/responsiveactions";
import { responsiveDrawerWidth } from "../../actions/types";
import UserVsLeadStatus from "./showUserVsLeadsAnal"

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let menu = [
            <Button type="link" onClick={this.showDrawer} icon="plus">Add Form</Button>
        ];
        return (
            <Fragment>
                <PageHeader className="align-right page-header" />
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                    <UserVsLeadStatus />
                    </Col>
                </Row>
            </Fragment>
        );
    }
    }
    
    export default AnalyticsDashboard

