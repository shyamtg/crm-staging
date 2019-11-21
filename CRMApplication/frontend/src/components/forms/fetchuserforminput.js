import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { ac_fetchUserFormInputs } from '../../actions/forms/getforminputs';
import { ac_deleteFormInput } from '../../actions/forms/deleteforminput';
import { Spin, List, Icon, Pagination, Button, Alert } from "antd";
import {
    Link,
    withRouter
} from "react-router-dom";
import { URL_FORMS } from "../common/url";
import { DATA_PER_PAGE, DATE_TIME_WORDINGS } from "../../actions/types";
import { reset } from "../../actions/common";
import { GET_FORMS_INPUTS_RESET, DELETE_FORM_INPUT_RESET } from "../../actions/types";
import moment from "moment";

class UserFormInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1
        };
        this.props.ac_fetchUserFormInputs({
            status: this.props.status ? this.props.status : 'draft',
            ...(this.props.selectedUsers.length > 0 && { filter_users: this.props.selectedUsers })
        });
    }
    componentWillUnmount() {
        this.props.reset(GET_FORMS_INPUTS_RESET);
        this.props.reset(DELETE_FORM_INPUT_RESET);
    }
    pageChange = e => {
        this.props.ac_fetchUserFormInputs(this.props.status ? this.props.status : 'draft', e);
        this.props.ac_fetchUserFormInputs({
            status: this.props.status ? this.props.status : 'draft',
            page: e,
            ...(this.props.selectedUsers.length > 0 && { filter_users: this.props.selectedUsers })
        });
        this.setState({ currentPage: e });
    };
    deleteFormInput = inputid => {
        this.props.ac_deleteFormInput(inputid);
    }
    render() {
        let form_input_data = this.props.re_formsInputs;
        let delete_form_input = this.props.re_deleteFromInput;
        return (
            <Fragment>
                {delete_form_input.isError ? <Alert type="error" description={delete_form_input.isError} /> : null}
                {form_input_data.isLoading ? <Spin /> :
                    <Fragment>
                        <List
                            itemLayout="horizontal"
                            dataSource={(form_input_data.form_input) ? form_input_data.form_input : []}
                            renderItem={(item) => (
                                <List.Item
                                    className="user-list"
                                    actions={[
                                        <Link to={URL_FORMS + "/" + item.form.toString() + "/?id=" + item.id.toString()}><Icon type="eye" /> View</Link>,
                                        <Button type="link" onClick={e => this.deleteFormInput(item.id)} icon="delete">Delete</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.friendly_name}
                                        description={item.user.first_name + ' @' + moment(item.last_updated_on).format(DATE_TIME_WORDINGS)}
                                    />
                                </List.Item>
                            )}

                        />
                        <Pagination
                            hideOnSinglePage={true}
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                            defaultPageSize={DATA_PER_PAGE}
                            total={form_input_data.count}
                        />
                    </Fragment>}
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    re_formsInputs: state.getFormsInputs,
    re_myProfile: state.myProfile,
    re_deleteFromInput: state.deleteFromInput
});
export default connect(mapStateToProps, {
    ac_fetchUserFormInputs,
    reset,
    ac_deleteFormInput
})
    (withRouter(UserFormInputs))