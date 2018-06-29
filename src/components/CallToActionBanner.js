import React, { Component } from 'react';
import { Button, Col, Form, Icon, Row } from 'antd';

import MarketSubscriberForm from './MarketSubscriberForm';

// Styles
import '../less/CallToActionBanner.less';

export const emailLink = `mailto:partnerships@marketprotocol.io?subject=Partnership%20with%20MARKET%20Protocol&body=
  Please%20explain%20your%20company%20and%20your%20interest%20
  in%20the%20protocol%20as%20well%20as%20any%20other%20helpful%20details.`;

class CallToActionBannerComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptionPopUpVisible: false
    };
  }

  render() {
    return (
      <div className="banner-wrapper">
        <Row type="flex" justify="center">
          <Col xs={24} md={12} lg={9} xxl={6}>
            <div className="button-container">
              <h2 className="action-text">Join our Newsletter</h2>
              <Button
                onClick={() =>
                  this.setState({ subscriptionPopUpVisible: true })
                }
                type="primary"
                style={{ width: '100%', textAlign: 'left' }}
              >
                Click To Subscribe
                <Icon
                  type="arrow-right"
                  style={{ position: 'absolute', top: '35%', right: '15px' }}
                />
              </Button>

              <MarketSubscriberForm
                onCancel={() =>
                  this.setState({ subscriptionPopUpVisible: false })
                }
                visible={this.state.subscriptionPopUpVisible}
              />
            </div>
          </Col>
          <Col xs={24} md={12} lg={9} xxl={6}>
            <div className="button-container">
              <h2 className="action-text">Become a Partner</h2>
              <Button
                href={emailLink}
                type="primary"
                style={{ width: '100%', textAlign: 'left' }}
              >
                Email Us
                <Icon
                  type="arrow-right"
                  style={{ position: 'absolute', top: '35%', right: '15px' }}
                />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const CallToActionBanner = Form.create()(CallToActionBannerComponent);

export default CallToActionBanner;
