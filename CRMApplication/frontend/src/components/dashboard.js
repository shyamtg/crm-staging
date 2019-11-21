import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Layout, Row, Col, Card, Icon, Button, Input } from "antd";
import UserVsLeadStatus from "./analytics/showUserVsLeadsAnal"
import UserCalendar from "./appointment/calendar";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {URL_APP_BOOKING} from "../components/common/url"
const { Meta } = Card;

class MeetingLink extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      customMin: 60 , 
      url: window.location.hostname +URL_APP_BOOKING+"/"+ 
      this.props.myProfile.user.username+"/"+
      "?slot_duration="+60
    };
  }

  onMinChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      value === "" ||
      value === "-"
    ) {
      this.setState({ customMin: value, url: window.location.hostname +URL_APP_BOOKING+"/"+ 
      this.props.myProfile.user.username+"/"+
      "?slot_duration="+value});
    } else {
      this.setState({ customMin: 60 });
    }
  };

  generateLink = (min, e) => {
    message.success("Link copied successfully");
  };
  render() {
    return (
      <section>
        <br/>
        <Row type="flex" gutter={16}>
          <Col xs={24} sm={24} md={12} lg={6} >
            <Card
              style={{height:'200px'}}
              actions={[
                <CopyToClipboard text={this.state.url}
                  onCopy={() => this.setState({ copied: true })}>
                  <Button
                    onClick={e => this.generateLink(this.state.customMin, e)}
                    type="primary"
                   >
                    Copy Link
                </Button>
                </CopyToClipboard>
              ]}
            >
              <Meta
                avatar={<Icon type="calendar" />}
                title="Booking Link"
                description={
                  <div>
                    <Input
                      onChange={this.onMinChange}
                      addonAfter="Custom min."
                      value={this.state.customMin}
                      placeholder="Min."
                    />
                  </div>
                }
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={6} className="mini-box">
            {/* <div className="mini-box">hello </div> */} 
            <div style={{height:'200px',overflow:'auto',padding: '20px 10px 0px 10px'}} className="mini-cal-view"><UserCalendar minView="true" /></div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
          </Col>
        </Row>
        <br />
        <Row className="content-section">
          <Col xs={24} sm={24} md={24} lg={24}>
          <UserVsLeadStatus />
          </Col>
        </Row>

      </section>
    );
  }
}

class Dashboard extends Component {
  render() {
    return <MeetingLinkApp />;
  }
}

const mapStateToProps = state => ({ auth: state.auth, myProfile: state.myProfile });
export default connect(mapStateToProps)(Dashboard);

const MeetingLinkApp = connect(mapStateToProps)(MeetingLink)