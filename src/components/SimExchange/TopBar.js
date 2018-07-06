import React, { Component } from 'react';
import { Button, Col, Dropdown, Icon, Menu, Row } from 'antd';
import Loader from '../Loader';
import _ from 'lodash';

class TopBar extends Component {
  render() {
    const { contract, contracts } = this.props;
    let validContracts = _.compact(contracts);

    const menu = (
      <Menu onClick={e => this.props.onSelectContract(e.item.props.contract)}>
        {validContracts &&
          validContracts.map(c => (
            <Menu.Item key={c.key} contract={c}>
              {c.CONTRACT_NAME}
            </Menu.Item>
          ))}
      </Menu>
    );

    return (
      <div>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={12}>
            {contracts && (
              <Dropdown overlay={menu}>
                <Button>
                  {contract ? contract.CONTRACT_NAME : 'Contracts'}{' '}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )}

            {!contracts && <Loader loading={true} />}
            {!contracts && <span>Loading Contracts, Please Wait...</span>}
          </Col>
        </Row>
      </div>
    );
  }
}

export default TopBar;
