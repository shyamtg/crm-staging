import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import api from "../../apiurl";
import { ac_checksu } from "../../actions/accounts/usermanagement/checksu";
import { createTeam } from "../../actions/team/registerteam";
import ImgCrop from "antd-img-crop";
import {
  PageHeader,
  Checkbox,
  Tabs,
  Divider,
  Radio,
  Alert,
  Form,
  Input,
  Button,
  Spin,
  Row,
  Col,
  Select,
  Result,
  Upload,
  Icon,
  message,
  Steps
} from "antd";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    this.props.ac_checksu();
    this.state = {
      loading: false,
      selectedFile: null,
      profile_pic: ""
    };
  }

  handleChange = info => {
    // if (info.file.status === "uploading") {
    // this.setState({ loading: true });
    // return;
    // }
    // if (info.file.status === "done") {
    // Get this url from response in real world.

    getBase64(info.file.originFileObj, imageUrl =>
      this.setState({
        imageUrl,
        loading: false
      })
    );
    // }
  };
  handleUpload = e => {
    var r = new FileReader();
    r.onload = () => {
      console.log(r.result);
      this.setState({ profile_pic: r.result });
    };
    r.readAsDataURL(e.file);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.profile_pic = this.state.profile_pic;
      if (!err) {
        this.props.createTeam(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    const { current } = this.state;
    return (
        <Fragment>
          <PageHeader className="align-right page-header"></PageHeader>
          <Row className="content-section" type="flex" justify="left">
          <Col  xs={24} sm={24} md={18} lg={12}>
          <Divider orientation="right">
          <Icon type="team" style={{fontSize: '40px' , color: '#1790ff'}}/>
          </Divider>
          {this.props.createTeam.isError ? 
            <Alert
              style={{ display: "inline-block" }}
              message="Team Creation Failed"
              description={this.props.createTeamData.isError}
              type="error"
              closable
            />
           : null}
          {this.props.checksu.isLoading ? (
            <Spin />
          ) : this.props.checksu.issu ? (
            <Fragment>
                  <Form.Item label="Team Name">
                    {getFieldDecorator("team_name", {
                      rules: [
                        {
                          required: true,
                          message: "Please enter Team Name"
                        }
                      ]
                    })(<Input placeholder="Please enter Team Name" />)}
                  </Form.Item>
                  <Form.Item label="Description">
                    {getFieldDecorator("desc", {
                      rules: [
                        {
                          required: false
                        }
                      ]
                    })(<Input placeholder="Description.." />)}
                  </Form.Item>
                  <Form.Item label="Profile Picture">
                    {getFieldDecorator("profile_pic", {
                      rules: [
                        {
                          required: false
                        }
                      ]
                    })(
                      <ImgCrop resize={false} width={180} height={180}>
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="profile-pic"
                          showUploadList={false}
                          customRequest={this.handleUpload}
                          beforeUpload={beforeUpload}
                          onChange={this.handleChange}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="avatar"
                              style={{ width: "100%" }}
                            />
                          ) : (
                            uploadButton
                          )}
                        </Upload>
                      </ImgCrop>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit}>
                      Create Team
                    </Button>
                  </Form.Item></Fragment>) : (<Result status="warning" title="Sorry, you don't have access" />
          )}
          </Col>
          </Row>
        </Fragment>
      )
  }
}

const mapStateToPropsCreateTeam = state => ({
  TeamData: state.createTeam,
  checksu: state.checksu
});

const createForm = Form.create({ name: "createTeam" })(CreateTeam);

export default connect(
  mapStateToPropsCreateTeam,
  {
    ac_checksu,
    createTeam
  }
)(createForm);
