import React, { Fragment } from "react";
import { connect } from "react-redux";
import 'react-form-builder2/dist/app.css';
import { ac_fetchFormDetails } from '../../actions/forms/fetchformdetails';
import { ac_getFormInput } from '../../actions/forms/getforminputs';
import { ac_saveForm } from '../../actions/forms/saveforminputs';
import { Spin, message, Icon, Input, Divider, Row, Col, PageHeader, Alert } from "antd";
import { reset } from "../../actions/common";
import { querystring } from "../common/utils";
import { FORM_INPUT_SAVE_RESET, FORM_DETAILS_RESET, FORM_INPUT_DETAILS_RESET } from "../../actions/types";
import { URL_FORMS } from "../common/url";
import {
    Redirect,
    withRouter
} from "react-router-dom";
var FormBuilder = require('react-form-builder2');

function getFieldValue(value_list, fieldname) {
    let value = '';
    value_list.forEach(function (item, idx) {
        if (item.name == fieldname) {
            value = item.value;
            return true;
        }
    });
    return value;
}

/* below class will be used to display the form and get user inputs.
user inputs can be saved as draft or submitted. Once submitted form will load in readonly mode 
URL format forms/<formid>/id=<inputid>
formid will be used to fetch form fields 
inputid will be used to fetch inputs of form id */

class ViewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { form_input_id: null, friendly_name_disabled: true }
        this.form_friendly_name = React.createRef();
        if (this.props.match.params.id) {
            //collect form fields
            this.props.ac_fetchFormDetails(this.props.match.params.id);
        }
        if (querystring('id')) {
            //collect form anwsers
            this.state.form_input_id = querystring('id');
            this.props.ac_getFormInput(querystring('id'));
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (querystring('id') !== prevState.form_input_id) {
            // fetch the new product based and set it to the state of the component
            this.setState({ form_input_id: querystring('id') });
            this.props.ac_getFormInput(querystring('id'));
        };
    }
    componentWillUnmount() {
        this.props.reset(FORM_DETAILS_RESET);
        this.props.reset(FORM_INPUT_DETAILS_RESET);
        this.props.reset(FORM_INPUT_SAVE_RESET);
    }
    change_friendly_name_disabled = (status) => {
        this.setState({ friendly_name_disabled: status });
    }
    onSubmit = (formid, e) => {
        let data = {};
        if (this.form_friendly_name.current.state.value == '') {
            message.error('Enter form friendly name');
            return false;
        }
        data["user"] = this.props.re_myProfile.user.id;
        data['friendly_name'] = this.form_friendly_name.current.state.value;
        data['form'] = formid;
        data['form_data'] = e;
        data['status'] = 'submit';
        this.props.ac_saveForm(data, this.state.form_input_id);
    }
    onSaveDraft = (formid, e) => {
        let data = {};
        if (this.form_friendly_name.current.state.value == '') {
            message.error('Enter form friendly name');
            return false;
        }
        data["user"] = this.props.re_myProfile.user.id;
        data['friendly_name'] = this.form_friendly_name.current.state.value;
        data['form'] = formid;
        data['form_data'] = e;
        this.props.ac_saveForm(data, this.state.form_input_id);
    }
    showFieldValue = (ans_input) => {
        if (this.props.re_fetchFormDetails.form) {
            if (this.props.re_fetchFormDetails.form.form_fields) {
                let data = JSON.parse(this.props.re_fetchFormDetails.form.form_fields);
                return data.map(function (item, idx) {
                    return <div><label>{item.label}</label><span>{getFieldValue(ans_input, item.field_name)}</span></div>;
                });
            }
        }
    }
    render() {
        let form_details = this.props.re_fetchFormDetails;
        let form_input_data = this.props.re_formInputDetails;
        let save_form_input = this.props.re_saveFormInput;
        if (!save_form_input.isLoading && save_form_input.form_input && !this.state.form_input_id) {
            //after saving the draft for first time redirect to draft URL with querystring
            return <Redirect to={
                URL_FORMS + "/" + save_form_input.form_input.form + "/?id=" + save_form_input.form_input.id.toString()
            } />
        }
        return (
            <Fragment>
                <PageHeader className="align-right page-header" />
                <Row className="content-section">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        {form_details.isError ? <Alert
                            type="error"
                            description={form_details.isError} /> : null}
                        {form_input_data.isError ? <Alert
                            type="error"
                            description={form_details.isError} /> : null}
                        {form_details.isLoading || form_input_data.isLoading ? <Spin /> :
                            form_details.form ?
                                <Fragment>
                                    {/* Check if draft already has a name else generate a new name */}
                                    <Row>
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <Divider orientation="left">
                                                {
                                                    form_input_data.form_input_details && form_input_data.form_input_details.status == 'submit' ?
                                                        <span className="form-name">{form_details.form.form_name}</span>
                                                        :
                                                        <Input
                                                            defaultValue={form_input_data.form_input_details ? form_input_data.form_input_details.friendly_name :
                                                                form_details.form.form_name + "_" + Date.now().toString()}
                                                            maxLength={45}
                                                            className="form-name"
                                                            style={{ minWidth: '350px' }}
                                                            disabled={this.state.friendly_name_disabled}
                                                            ref={this.form_friendly_name}
                                                            addonAfter={
                                                                this.state.friendly_name_disabled ?
                                                                    <Icon onClick={e => this.change_friendly_name_disabled(false)} type="edit" /> :
                                                                    <Icon onClick={e => this.change_friendly_name_disabled(true)} type="check" />
                                                            }
                                                            placeholder="Enter friendly name" />
                                                }
                                            </Divider>
                                        </Col>
                                    </Row>

                                    <Row className={"form-section " + (form_input_data.form_input_details && form_input_data.form_input_details.status == 'submit' ? 'form-disabled' : 'form-active')}>
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <FormBuilder.ReactFormGenerator
                                                onSubmit={e => { this.onSubmit(form_details.form.id, e) }}
                                                onSaveDraft={e => { this.onSaveDraft(form_details.form.id, e) }}
                                                answer_data={form_input_data.form_input_details ? form_input_data.form_input_details.form_data : []}
                                                read_only={form_input_data.form_input_details && form_input_data.form_input_details.status == 'submit' ? true : false}
                                                data={form_details.form.form_fields ? JSON.parse(form_details.form.form_fields) : []} // Question data
                                            />
                                        </Col>
                                    </Row>
                                </Fragment> : null}
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    re_fetchFormDetails: state.fetchFormDetails,
    re_myProfile: state.myProfile,
    re_formInputDetails: state.getFormInputDetails,
    re_saveFormInput: state.saveFormInput
});
export default connect(
    mapStateToProps,
    {
        ac_fetchFormDetails,
        reset,
        ac_saveForm,
        ac_getFormInput
    })
    (withRouter(ViewForm))