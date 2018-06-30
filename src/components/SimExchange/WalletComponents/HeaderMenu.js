import React, { Component } from 'react';
import { Market } from '@marketprotocol/marketjs';
import abi from 'human-standard-token-abi';

import { Card, Row, Modal, Col } from 'antd';

import Form from './Form';
import { getCollateralTokenAddress } from '../../../util/utils';

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    if (props.web3.web3Instance) {
      this.marketjs = new Market(props.web3.web3Instance.currentProvider);
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);

    this.state = {
      amount: {},
      transaction: {},
      unallocatedCollateral: 0,
      availableCollateral: 0
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.simExchange.contract !== this.props.simExchange.contract &&
      nextProps.simExchange.contract !== null
    ) {
      await this.marketjs
        .getUserAccountBalanceAsync(
          nextProps.simExchange.contract.key,
          nextProps.web3.web3Instance.eth.accounts[0]
        )
        .then(res => {
          this.setState({
            unallocatedCollateral:
              nextProps.web3.web3Instance.toDecimal(res) / 1000000000000000000
          });
        });

      let contractInstance = await nextProps.web3.web3Instance.eth
        .contract(abi)
        .at(
          getCollateralTokenAddress(
            nextProps.web3.network,
            nextProps.simExchange.contract.COLLATERAL_TOKEN_SYMBOL
          )
        );

      contractInstance.balanceOf.call(
        nextProps.web3.web3Instance.eth.accounts[0],
        (err, res) => {
          if (err) {
            console.error(err);
          } else {
            this.setState({
              availableCollateral:
                nextProps.web3.web3Instance.toDecimal(res) / 1000000000000000000
            });
          }
        }
      );
    }
  }

  onSubmit(amount) {
    console.log('amount', amount);
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
    let marketjs = this.marketjs;
    const { simExchange, web3 } = this.props;
    const { amount } = this.state;

    if (amount.type === 'deposit') {
      console.log(
        'deposit values',
        simExchange.contract.key,
        web3.web3Instance.toBigNumber(parseFloat(amount.number))
      );
      marketjs
        .depositCollateralAsync(
          simExchange.contract.key,
          web3.web3Instance.toBigNumber(parseFloat(amount.number))
        )
        .then((err, res) => {
          if (err) {
            console.error('deposit', res);
          } else {
            console.log('deposit', res);
          }
        });
    } else {
      marketjs
        .withdrawCollateralAsync(
          simExchange.contract.key,
          web3.web3Instance.toBigNumber(amount.number)
        )
        .then((err, res) => {
          if (err) {
            console.error('withdraw', res);
          } else {
            console.log('withdraw', res);
          }
        });
    }
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
            extra={
              contract && (
                <span>
                  Available:{' '}
                  {`${this.state.availableCollateral}
                  ${contract.COLLATERAL_TOKEN_SYMBOL}`}
                </span>
              )
            }
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
