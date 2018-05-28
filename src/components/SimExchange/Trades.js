import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';

import TradeContainer from './TradeContainer';

import './Trades.css';

const { Content } = Layout;

class Trades extends Component {
  render() {
    return (
      <Layout>
        <Content>
          <Row type="flex" justify="space-around" gutter={24}>
            <Col span={12}>
              <TradeContainer
                title="bid"
                market="ETX"
                tradeOrder={this.props.tradeOrder}
                data={this.props.bids}
              />
            </Col>
            <Col span={12}>
              <TradeContainer
                title="ask"
                market="ETX"
                tradeOrder={this.props.tradeOrder}
                data={this.props.asks}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Trades;
