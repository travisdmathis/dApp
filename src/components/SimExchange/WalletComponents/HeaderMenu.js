import React, { Component } from 'react';
import { Market } from '@marketprotocol/marketjs';
import abi from 'human-standard-token-abi';
import showMessage from '../../message';

import { Card, Row, Modal, Col } from 'antd';

import { toBaseUnit } from '../../../util/utils';

import Form from './Form';

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    if (props.web3 && props.web3.web3Instance) {
      this.marketjs = new Market(props.web3.web3Instance.currentProvider);
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.depositCollateral = this.depositCollateral.bind(this);
    this.withdrawCollateral = this.withdrawCollateral.bind(this);
    this.getBalances = this.getBalances.bind(this);

    this.state = {
      amount: {},
      transaction: {},
      unallocatedCollateral: 0,
      availableCollateral: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.simExchange.contract !== this.props.simExchange.contract &&
      nextProps.simExchange.contract !== null
    ) {
      this.getBalances(nextProps);
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
    const { amount } = this.state;

    switch (amount.type) {
      case 'deposit':
        this.depositCollateral();
        break;
      case 'withdraw':
        this.withdrawCollateral();
        break;
      default:
        break;
    }
  }

  async depositCollateral() {
    const marketjs = this.marketjs;
    const { simExchange, web3 } = this.props;
    const { amount } = this.state;
    let txParams = {
      from: web3.web3Instance.eth.coinbase
    };

    let collateralTokenContractInstance = web3.web3Instance.eth
      .contract(abi)
      .at(simExchange.contract.COLLATERAL_TOKEN_ADDRESS);

    await collateralTokenContractInstance.decimals.call((err, res) => {
      this.setState({
        decimals: res.toNumber()
      });
    });

    collateralTokenContractInstance.approve(
      simExchange.contract.MARKET_COLLATERAL_POOL_ADDRESS,
      web3.web3Instance.toBigNumber(
        toBaseUnit(amount.number, this.state.decimals)
      ),
      txParams,
      (err, res) => {
        marketjs
          .depositCollateralAsync(
            simExchange.contract.MARKET_COLLATERAL_POOL_ADDRESS,
            web3.web3Instance.toBigNumber(
              toBaseUnit(amount.number, this.state.decimals)
            ),
            txParams
          )
          .then(res => {
            showMessage(
              'success',
              'Deposit successful, your transaction will process shortly.',
              5
            );
          });
      }
    );
  }

  getBalances(props) {
    this.marketjs
      .getUserAccountBalanceAsync(
        props.simExchange.contract.MARKET_COLLATERAL_POOL_ADDRESS,
        props.web3.web3Instance.eth.coinbase
      )
      .then(res => {
        const unallocatedCollateral = props.web3.web3Instance
          .fromWei(res.toFixed(), 'ether')
          .toString();

        this.setState({
          unallocatedCollateral: unallocatedCollateral
        });
      })
      .then(() => {
        let contractInstance = props.web3.web3Instance.eth
          .contract(abi)
          .at(props.simExchange.contract.COLLATERAL_TOKEN_ADDRESS);

        contractInstance.balanceOf.call(
          props.web3.web3Instance.eth.coinbase,
          (err, res) => {
            if (err) {
              console.error(err);
            } else {
              const availableCollateral = props.web3.web3Instance
                .fromWei(res.toFixed(), 'ether')
                .toString();

              this.setState({
                availableCollateral: availableCollateral
              });
            }
          }
        );
      });
  }

  withdrawCollateral() {
    let marketjs = this.marketjs;
    const { simExchange, web3 } = this.props;
    const { amount } = this.state;
    const txParams = {
      from: web3.web3Instance.eth.coinbase
    };

    let collateralTokenContractInstance = web3.web3Instance.eth
      .contract(abi)
      .at(simExchange.contract.COLLATERAL_TOKEN_ADDRESS);

    collateralTokenContractInstance.decimals.call((err, decimals) => {
      marketjs
        .withdrawCollateralAsync(
          simExchange.contract.MARKET_COLLATERAL_POOL_ADDRESS,
          toBaseUnit(amount.number, decimals),
          txParams
        )
        .then(res => {
          showMessage(
            'success',
            'Withdraw successful, your transaction will process shortly.',
            5
          );
        });
    });
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
              className="deposit-form"
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
              className="withdraw-form"
            />
          </Card>
        </Col>
        <Modal
          title="Confirmation required"
          visible={this.state.modal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className="collateral-modal"
        >
          <h3>
            Are you sure you want to {amount && amount.type}{' '}
            {amount && amount.number}{' '}
            {contract && contract.COLLATERAL_TOKEN_SYMBOL}?
          </h3>
        </Modal>
      </Row>
    );
  }
}

export default HeaderMenu;
