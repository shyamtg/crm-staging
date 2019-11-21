import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ImgCrop from 'antd-img-crop';
import api from "../../apiurl";
import { tokenConfig } from "../../actions/accounts/usermanagement/auth";
import {
    Icon,
    message,
    Upload
} from "antd";
import {store} from "../../index"
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
class UserProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            imageUrl:(this.props.userData ? this.props.userData.profile_pic : '')
        };
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };
    handleUpload = (e) => {
        let headers = tokenConfig(store.getState);
        headers["headers"]["Content-Type"] = "multipart/form-data";
        const body = new FormData();
        body.set("profile_pic",e.file)
        api
            .patch(e.action, body, {
                headers: headers["headers"]
            })
            .then(respones => {
                e.onSuccess(respones.body);
            })
            .catch(err => {
                e.onError(err);
            });
    };

render() {
    const uploadButton = (
        <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    const { imageUrl } = this.state;
    return (
        this.props.userData ? 
        <ImgCrop resize={false} width={180} height={180}>
            <Upload
                name="profile_pic"
                listType="picture-card"
                className="profile-pic"
                showUploadList={false}
                action={api.defaults.baseURL + "/users/" + this.props.userData.id + "/"}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
                customRequest={this.handleUpload}

            >        {imageUrl ? <img src={imageUrl} alt="Profile" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        </ImgCrop> : ''
    );

}
}
const mapStateToProps = state => ({
    auth: state.auth,
    myProfile: state.myProfile
});


export default connect(
    mapStateToProps,
    {}
)(UserProfilePic);
