import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Alert } from 'antd';
import { ac_createForm } from "../../actions/forms/createform";
import { reset } from "../../actions/common";
import { CREATE_FORM_RESET } from "../../actions/types";
import { Redirect, withRouter } from "react-router-dom";
import { URL_FORMS_EDIT } from "../common/url";

/* CreateFormClass is used to construct a dynamic form.
when a form is created it just take form friendly name as input and
fields needs to be created with editform component */

export class CreateFormClass extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.ac_createForm(values);
            }
        });
    };
    componentWillUnmount() {
        this.props.reset(CREATE_FORM_RESET);
    }
    render() {
        let create_form = this.props.createForm;
        if (create_form.form) {
            return <Redirect to={URL_FORMS_EDIT+"/"+create_form.form.id.toString()} />;
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Fragment>
                {create_form.isError ? <Alert
                    message="Form creation failed"
                    description={create_form.isError}
                    type="error"
                    closable
                /> : null}
                <Form onSubmit={this.handleSubmit} >
                    <Form.Item>
                        {getFieldDecorator('form_name', {
                            rules: [{ required: true, message: 'Please input form name!' }],
                        })(
                            <Input
                                placeholder="Form name"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" loading={create_form.isLoading} htmlType="submit">
                            {create_form.isLoading ? 'Loading' : 'Submit'}
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    createForm: state.createForm
});
const CreateFormApp = Form.create({ name: 'createfrom' })(CreateFormClass);

export default connect(mapStateToProps, { reset, ac_createForm })(withRouter(CreateFormApp));