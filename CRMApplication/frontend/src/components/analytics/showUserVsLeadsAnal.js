import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
    Form,
    DatePicker,
    Button,
    Drawer,
    Row,
    Col,
    Icon,
    Spin,
    Alert
} from "antd";
import { ANA_USER_LEAD_RESET } from "../../actions/types";
import { ac_uservslead } from "../../actions/analytics/uservslead";
import { reset } from "../../actions/common/index";
import { FilterUI } from "../appointment/filterappointments";
import { isMobile, DATE_FORMAT, YEAR_MONTH_FORMAT } from "../../actions/types";
import moment from "moment";
import { SearchSelectUsers } from "../common/search-select-users";
import { isAdmin } from "../common/utils";
// import "@amcharts/amcharts3-react";

// var AmCharts = require("@amcharts/amcharts3-react");
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

class UserVsLeadStatusFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            start_date: moment(new Date()).format(DATE_FORMAT),
            end_date:
                moment().format(YEAR_MONTH_FORMAT) + "-" + moment().daysInMonth(),
        }
        this.props.ac_uservslead({
            start_time_after: this.state.start_date,
            end_time_before: this.state.end_date,
        });
    }
    handleFilter = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.selectedUsers.length > 0) {
                    this.props.ac_uservslead({
                        start_time_after: moment(values.start_date).format(DATE_FORMAT),
                        end_time_before: moment(values.end_date).format(DATE_FORMAT),
                        user: this.state.selectedUsers
                    });
                }
                else {
                    this.props.ac_uservslead({
                        start_time_after: moment(values.start_date).format(DATE_FORMAT),
                        end_time_before: moment(values.end_date).format(DATE_FORMAT),
                    });
                }

            }
        });
    };

    getSelectedUser = (users) => {
        this.setState({ selectedUsers: users });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form
                layout="inline"
                className="filterappoinments-form"
                style={{ marginBottom: "15px" }}
                onSubmit={this.handleFilter}>
                <Form.Item label="From" htmlFor="start_date">
                    {getFieldDecorator("start_date", {
                        rules: [{ required: false, message: "Please select time!" }],
                        initialValue: moment(this.state.start_date, DATE_FORMAT)
                    })(<DatePicker />)}
                </Form.Item>
                <Form.Item label="To" htmlFor="end_date">
                    {getFieldDecorator("end_date", {
                        rules: [{ required: false, message: "Please select time!" }],
                        initialValue: moment(this.state.end_date, DATE_FORMAT)
                    })(<DatePicker />)}
                </Form.Item>
                {isAdmin() ?
                    <Form.Item>
                        <SearchSelectUsers getSelectedUser={this.getSelectedUser} multiSelect={false} />
                    </Form.Item>
                    : null}
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        <Icon type="filter" />
                        Apply
                  </Button>
                </Form.Item>
            </Form>
        );
    }
}
class UserVsLeadStatus extends Component {
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        this.props.reset(ANA_USER_LEAD_RESET);
    }
    componentDidUpdate(oldProps) {
        if (oldProps.re_userLeadData !== this.props.re_userLeadData) {
            if (this.chart) {
                this.chart.dispose();
            }
            let chart = am4core.create("chartdiv", am4charts.PieChart3D);

            chart.hiddenState.properties.opacity = 0;
            chart.legend = new am4charts.Legend();
            let title = chart.titles.create();
            title.text = "Lead Stats";
            title.fontSize = 25;
            title.marginBottom = 30;
            //chart.innerRadius = am4core.percent(30)

            chart.data = (this.props.re_userLeadData.data && this.props.re_userLeadData.data.length > 0) ? this.props.re_userLeadData.data : [{
                "lead_status": "No Data",
                "disabled": true,
                "count": 1000,
                "color": am4core.color("#dadada"),
                "opacity": 0.3,
                "strokeDasharray": "4,4",
                "tooltip": ""
            }];

            var series = chart.series.push((this.props.re_userLeadData.data && this.props.re_userLeadData.data.length > 0) ? new am4charts.PieSeries3D() : new am4charts.PieSeries());
            series.dataFields.value = "count";
            series.dataFields.category = "lead_status";
            series.labels.template.disabled = isMobile ? true : false;
            series.legendSettings.itemValueText = "{value}";

            /* Set tup slice appearance */
            var slice = series.slices.template;
            slice.propertyFields.fill = "color";
            slice.propertyFields.fillOpacity = "opacity";
            slice.propertyFields.stroke = "color";
            slice.propertyFields.strokeDasharray = "strokeDasharray";
            slice.propertyFields.tooltipText = "tooltip";


            series.labels.template.propertyFields.disabled = "disabled";
            series.ticks.template.propertyFields.disabled = "disabled";

            /* This creates initial animation */
            series.hiddenState.properties.opacity = 1;
            series.hiddenState.properties.endAngle = -90;
            series.hiddenState.properties.startAngle = -90;

            this.chart = chart;

        }
    }
    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }
    handleFilter() {

    }
    render() {
        let user_lead_data = this.props.re_userLeadData;

        return (
            <Fragment>
                {user_lead_data.isError ? (
                    <Alert type="error" message={user_lead_data.isError} />
                ) : null}
                <FilterUI>
                    <UserVsLeadStatusFilterApp />
                </FilterUI>
                {user_lead_data.isLoading ? (
                    <Spin />
                ) : null}
                <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>

            </Fragment>

        );
    }
}

const mapStateToProps = state => ({
    re_userLeadData: state.userLeadData
});
export default connect(mapStateToProps, { reset, ac_uservslead })(
    UserVsLeadStatus
);
const UserVsLeadStatusFilterForm = Form.create({ name: 'normal_login' })(UserVsLeadStatusFilter);
const UserVsLeadStatusFilterApp = connect(mapStateToProps, { reset, ac_uservslead })(
    UserVsLeadStatusFilterForm
);