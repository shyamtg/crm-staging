import React, { Fragment } from "react";
import { connect } from "react-redux";
import { List, Typography, Spin, Tabs, Upload, Icon, message, Row, Col, PageHeader, Input } from 'antd';
import { fetchsocialprofile_email } from "../../actions/social/fetchsocialprofile";

const { Dragger } = Upload;

class GetSocialProfile extends React.Component {

    constructor(props) {
        super(props);

    }
    onFormSubmit(e) {
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('myImage',this.state.file);
        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // };
        // axios.post("/upload",formData,config)
        //     .then((response) => {
        //         alert("The file is successfully uploaded");
        //     }).catch((error) => {
        // });
    }
    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    fetch_profile_email = (email) => {
        this.props.fetchsocialprofile_email(email);
    }
    render() {
        const { TabPane } = Tabs;
        const { Search } = Input;

        const cmp_style = {
            fileupload: {
                width: '100%'
            }

        };

        const props = {
            name: 'file',
            multiple: false,
            accept: 'image/*',
            listType: 'picture',
            action: 'http://127.0.0.1:8000/api/v1/upload',
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (
            <Fragment>
                <PageHeader className="page-header"></PageHeader>
                <Row className="content-section">
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Tabs defaultActiveKey="1" >
                            <TabPane tab="Search by Email" key="1">
                                <Row>
                                    <Col xs={24} sm={24} md={23} lg={12}>
                                        <Search
                                            placeholder="input email"
                                            enterButton="Search"
                                            size="large"
                                            onSearch={value => this.fetch_profile_email(value)}
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <div>
                                    <List
                                        loading={this.props.fetchSocialProfile.isLoading}
                                        header={<div>Profile</div>}
                                        bordered
                                        dataSource={this.props.fetchSocialProfile.result}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.title}
                                                    description={item.link}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab="Search by Image" key="2">
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24}>
                                        <Dragger  {...props}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="inbox" />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to find social profile</p>
                                            <p className="ant-upload-hint">
                                                Upload only jped, png
                                            </p>
                                        </Dragger>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </Fragment >
        );
    }
}
const mapStateToProps = state => ({
    fetchSocialProfile: state.fetchSocialProfile
});

export default connect(
    mapStateToProps,
    { fetchsocialprofile_email }
)(GetSocialProfile);
