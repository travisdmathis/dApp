import React, { Component } from 'react';
import { Market } from '@marketprotocol/marketjs';

import { Card, Row, Modal, Col } from 'antd';

import Form from './Form';

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: {},
      transaction: {},
      unallocatedCollateral: 0
    };

    this.marketjs = new Market(this.props.web3.web3Instance.currentProvider);

    this.onSubmit = this.onSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.simExchange.contract !== this.props.simExchange.contract &&
      nextProps.simExchange.contract !== null
    ) {
      this.marketjs
        .getUserAccountBalanceAsync(
          nextProps.simExchange.contract.key,
          nextProps.web3.web3Instance.eth.accounts[0]
        )
        .then(res => {
          this.setState({
            unallocatedCollateral: res.toString()
          });
        });
    }
  }

  onSubmit(amount) {
    this.setState({ amount });
  }

  showModal() {
    this.setState({ modal: true });
  }

  handleCancel() {
    this.setState({ modal: false });
  }

  handleOk() {
    this.setState({ modal: false });
  }

  render() {
    const { amount } = this.state;
    const { simExchange } = this.props;
    const contract = simExchange.contract;

    return (
      <Row gutter={24} className="header-menu">
        <Col span={12}>
          <Card
            title="Deposit Collateral"
            extra={contract && <span>Available: 10 WETH</span>}
          >
            <Form
              collateralToken={contract && contract.COLLATERAL_TOKEN_SYMBOL}
              onSubmit={this.onSubmit}
              showModal={this.showModal}
              type="deposit"
              amount={amount}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Withdraw Collateral"
            extra={
              contract && (
                <span>
                  Available:{' '}
                  {`${this.state.unallocatedCollateral}
                  ${contract.COLLATERAL_TOKEN_SYMBOL}`}
                </span>
              )
            }
          >
            <Form
              collateralToken={contract && contract.COLLATERAL_TOKEN_SYMBOL}
              onSubmit={this.onSubmit}
              showModal={this.showModal}
              type="withdraw"
              amount={amount}
            />
          </Card>
        </Col>
        <Modal
          title="Confirmation required"
          visible={this.state.modal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h3>
            Are you sure you want to {amount.type} {amount.number}{' '}
            {contract && contract.COLLATERAL_TOKEN_SYMBOL}?
          </h3>
        </Modal>
      </Row>
    );
  }
}

export default HeaderMenu;
