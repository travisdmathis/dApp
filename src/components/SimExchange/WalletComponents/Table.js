import React, { Component, Fragment } from 'react';
import InputDataDecoder from 'ethereum-input-data-decoder';
import abi from 'human-standard-token-abi';

import { Table, Row } from 'antd';

import columns from './Columns';
import _ from 'lodash';

class BuyTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: 1,
      transactions: []
    };

    this.decoder = new InputDataDecoder(abi);

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { simExchange, web3 } = nextProps;

    if (
      simExchange.contract &&
      this.props.simExchange.contract !== simExchange.contract
    ) {
      let filter = web3.web3Instance.eth.filter({
        fromBlock: '0x0',
        toBlock: 'latest',
        address: simExchange.contract.MARKET_COLLATERAL_POOL_ADDRESS
      });

      filter.get((error, transactions) => {
        let fetchedTransactions = [];

        transactions.forEach(transaction => {
          web3.web3Instance.eth.getTransaction(
            transaction.transactionHash,
            (error, response) => {
              const result = this.decoder.decodeData(response.input);
              console.log('transaction', result);

              if (
                response.from === web3.web3Instance.eth.coinbase ||
                response.to === web3.web3Instance.eth.coinbase
              ) {
                let payload = {
                  key: response.blockHash,
                  block: response.blockNumber,
                  inout:
                    response.from === web3.web3Instance.eth.coinbase
                      ? 'in'
                      : 'out',
                  type:
                    response.from === web3.web3Instance.eth.coinbase
                      ? 'deposit'
                      : 'withdraw',
                  addresses: {
                    from: response.from,
                    to: response.to
                  },
                  amount: response.value.toString(),
                  details: {
                    hash: response.blockHash
                  }
                };

                fetchedTransactions.push(payload);

                this.setState({
                  transactions: _.uniq(fetchedTransactions)
                });
              }
            }
          );
        });
      });
    }
  }

  onChange(value) {
    this.setState({
      inputValue: value
    });
  }

  render() {
    return (
      <Fragment>
        <Row gutter={24}>
          <h1 className="table-header-title">Transfer</h1>
          <Table dataSource={this.state.transactions} columns={columns} />
        </Row>
      </Fragment>
    );
  }
}

export default BuyTable;
