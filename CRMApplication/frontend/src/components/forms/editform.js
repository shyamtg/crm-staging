import React, { Fragment } from "react";
import { connect } from "react-redux";
import 'react-form-builder2/dist/app.css';
import { ac_fetchFormDetails } from '../../actions/forms/fetchformdetails';
import { ac_updateForm } from '../../actions/forms/updatefrom';
import { Spin, Button, PageHeader, Row, Col, Divider } from "antd";
import { reset } from "../../actions/common";
import { UPDATE_FORM_RESET, FORM_DETAILS_RESET } from "../../actions/types";
// import 'bootstrap/dist/css/bootstrap.min.css';

var FormBuilder = require('react-form-builder2');

/* EditForm class alows to add fields to a form dynamically */
class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.form_fields = [];
    if (this.props.match.params.id) {
      this.props.ac_fetchFormDetails(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.reset(UPDATE_FORM_RESET);
    this.props.reset(FORM_DETAILS_RESET);
  }
  setFormFields = (e) => {
    this.form_fields = e.task_data;
  }
  saveForm = (e, id) => {
    this.props.ac_updateForm(id, { form_fields: JSON.stringify(this.form_fields) });
  }
  render() {
    var items = [{
      key: 'TextInput',
      canHaveAnswer: true,
      name: 'Text Input',
      label: 'Placeholder Label',
      icon: 'fa fa-font',
      field_name: 'text_input_'
    },
    {
      key: 'Dropdown',
      canHaveAnswer: true,
      name: 'Dropdown',
      icon: 'fa fa-caret-square-o-down',
      label: 'Placeholder Label',
      field_name: 'dropdown_',
      options: []
    },
    {
      key: 'TextArea',
      canHaveAnswer: true,
      name: 'Multi-line Input',
      label: 'Placeholder Label',
      icon: 'fa fa-text-height',
      field_name: 'text_area_'
    },
    {
      key: 'Checkboxes',
      canHaveAnswer: true,
      name: 'Checkboxes',
      icon: 'fa fa-check-square-o',
      label: 'Placeholder Label',
      field_name: 'checkboxes_',
      options: []
    },
    {
      key: 'DatePicker',
      canDefaultToday: true,
      canReadOnly: true,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'hh:mm aa',
      showTimeSelect: false,
      showTimeSelectOnly: false,
      name: 'Date',
      icon: 'fa fa-calendar',
      label: 'Placeholder Label',
      field_name: 'date_picker_'
    },
    {
      key: 'Signature',
      canReadOnly: true,
      name: 'Signature',
      icon: 'fa fa-pencil-square-o',
      label: 'Signature',
      field_name: 'signature_'
    }
    ];
    let form_details = this.props.re_fetchFormDetails;
    let update_form = this.props.re_updateForm;
    return (
      <Fragment>
        <PageHeader className="align-right page-header" />
        <Row className="content-section">
        <Col xs={24} sm={24} md={24} lg={24}>
        {form_details.isLoading ?
          <Spin /> :
          form_details.form ?
            < Fragment >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Divider orientation="left">
                   <span className="form-name">{form_details.form.form_name}</span>
                  </Divider>
                </Col>
              </Row>
              <Row className="form-section">
              <Col xs={24} sm={24} md={24} lg={24}>
              {/* first check if new fields are added if yes then display this.form_fields else display existing fields using form_details.form.form_fields and if existing fields are null pass empty array */}
              <Button
                type="primary"
                className="pull-right"
                loading={update_form.isLoading}
                onClick={e => { this.saveForm(e, form_details.form.id) }}>
                {update_form.isLoading ? 'Loading' : 'Save'}
              </Button>
              {this.setFormFields({ task_data: (this.form_fields.length > 0 ? this.form_fields : form_details.form.form_fields ? JSON.parse(form_details.form.form_fields) : []) })}
              <FormBuilder.ReactFormBuilder
                task_id={form_details.form.id}
                data={this.form_fields} onPost={this.setFormFields}
                toolbarItems={items} />
              </Col>
              </Row>
            </Fragment >
            : null}
            </Col>
            </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  re_fetchFormDetails: state.fetchFormDetails,
  re_updateForm: state.updateForm
});
export default connect(mapStateToProps, { ac_fetchFormDetails, ac_updateForm, reset })(EditForm)
