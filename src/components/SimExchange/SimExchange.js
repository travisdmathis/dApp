import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Route, Redirect, Switch, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import TopBar from './TopBar';
import Trades from './Trades';
import Wallet from './Wallet';

import './SimExchange.less';

const { Content, Header, Sider } = Layout;

class SimExchange extends Component {
  componentWillMount() {
    if (!this.props.contracts) {
      this.props.getContracts();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contracts && !nextProps.contract) {
      this.props.selectContract(nextProps.contracts[0]);
    }
  }

  render() {
    const { asks, bids, contract, contracts, location } = this.props;

    if (!this.props.shouldRender) {
      return (
        <div
          className="text-center"
          style={{ fontSize: '18px', padding: '4em' }}
        >
          <strong>Coming soon...</strong>
        </div>
      );
    }

    return (
      <Layout>
        <Sider width={200}>
          <Menu mode="inline" selectedKeys={[location.pathname]}>
            <Menu.Item key="/exchange/trades/">
              <Link to="/exchange/trades/">Trades</Link>
            </Menu.Item>
            <Menu.Item key="/exchange/wallet/">
              <Link to="/exchange/wallet/">Wallet</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="exchange-content">
          <Header className="exchange-header">
            <TopBar
              contract={contract}
              contracts={contracts}
              onSelectContract={this.props.selectContract}
            />
          </Header>
          <Switch>
            <Route
              path="/:url*"
              exact
              strict
              render={props => <Redirect to={`${props.location.pathname}/`} />}
            />
            <Route
              path="/exchange/trades/"
              exact
              render={() => (
                <Trades
                  asks={asks}
                  bids={bids}
                  tradeOrder={this.props.tradeOrder}
                />
              )}
            />
            <Route path="/exchange/wallet/" exact component={Wallet} />
            <Redirect to="/exchange/trades/" />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(SimExchange);
