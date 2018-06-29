import React, { Component } from 'react';
import { Button, Col, Dropdown, Icon, Menu, Row } from 'antd';

class TopBar extends Component {
  render() {
    const { contract, contracts } = this.props;

    const menu = (
      <Menu onClick={e => this.props.onSelectContract(e.item.props.contract)}>
        {contracts &&
          contracts.map(c => (
            <Menu.Item key={c.key} contract={c}>
              {c.CONTRACT_NAME}
            </Menu.Item>
          ))}
      </Menu>
    );

    return (
      <div>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={12}>Last Price: 0.00453143 ETH</Col>
          <Col span={12}>
            {contracts && (
              <Dropdown overlay={menu}>
                <Button>
                  {contract ? contract.CONTRACT_NAME : 'Contracts'}{' '}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default TopBar;
