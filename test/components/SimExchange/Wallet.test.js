import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Web3 from 'web3';
import FakeProvider from 'web3-fake-provider';

import Wallet from '../../../src/components/SimExchange/Wallet';
import Table from '../../../src/components/SimExchange/WalletComponents/Table';
import HeaderMenu from '../../../src/components/SimExchange/WalletComponents/HeaderMenu';
import Form from '../../../src/components/SimExchange/WalletComponents/Form';
import sinon from 'sinon';

function mockedCoinbaseWeb3(
  callbackError = null,
  coinbaseAddress = '0x123456',
  transaction = {}
) {
  const fakeProvider = new FakeProvider();
  const web3 = new Web3(fakeProvider);
  fakeProvider.injectResult(['0x98765']);
  web3.eth.getCoinbase = callback => {
    callback(callbackError, coinbaseAddress);
  };
  web3.eth.getTransaction = callback => {
    callback(callbackError, transaction);
  };
  return web3;
}

const mockContract = {
  key: '0xaaa0099',
  CONTRACT_NAME: 'ETHXBT',
  COLLATERAL_TOKEN: 'FakeDollars',
  COLLATERAL_TOKEN_SYMBOL: 'FUSD',
  MARKET_COLLATERAL_POOL_ADDRESS: '0x8d8xsaw89wfx89892s66267s9',
  PRICE_FLOOR: '60465',
  PRICE_CAP: '20155',
  PRICE_DECIMAL_PLACES: '2',
  QTY_MULTIPLIER: '10',
  ORACLE_QUERY:
    'json(https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0',
  EXPIRATION: '',
  lastPrice: '105700',
  isSettled: true,
  collateralPoolBalance: ''
};

describe('Wallet', () => {
  it('renders wallet', () => {
    const component = shallow(<Wallet />);

    const containsHeaderMenu = component.containsMatchingElement(
      <HeaderMenu />
    );
    const containsTable = component.containsMatchingElement(<Table />);

    expect(containsHeaderMenu, 'Should render header menu').to.be.true;
    expect(containsTable, 'Should render table').to.be.true;
  });
});

describe('HeaderMenu', () => {
  it('renders form', () => {
    const web3 = mockedCoinbaseWeb3();
    const props = {
      amount: {
        type: 'deposit',
        value: '1'
      },
      simExchange: {
        contract: ''
      },
      web3: {
        web3Instance: web3
      }
    };
    const headerMenu = mount(<HeaderMenu {...props} />);
    const containsForm = headerMenu.containsMatchingElement(<Form />);

    headerMenu.setProps({
      amount: {
        type: 'deposit',
        value: '1'
      },
      simExchange: {
        contract: mockContract
      }
    });

    expect(headerMenu.props().amount.value).to.equal('1');
    expect(headerMenu.props().amount.type).to.equal('deposit');
    expect(containsForm, 'Should render deposit/withdraw form').to.be.true;
  });

  it('should show confirmation modal on deposit', () => {
    const web3 = mockedCoinbaseWeb3();
    const props = {
      simExchange: {
        contract: ''
      },
      web3: {
        web3Instance: web3
      },
      amount: {},
      modal: false
    };
    const headerMenu = mount(<HeaderMenu {...props} />);

    const onSubmit = sinon.spy();

    const form = mount(
      <Form type="deposit" amount={props.amount} onSubmit={onSubmit} />
    );

    expect(form).to.have.length(1);
    expect(headerMenu.props().modal).to.equal(false);

    form.props().onSubmit();

    expect(onSubmit.called).to.equal(true);
  });

  it('should show confirmation modal on withdraw', () => {
    const web3 = mockedCoinbaseWeb3();
    const props = {
      simExchange: {
        contract: mockContract
      },
      web3: {
        web3Instance: web3
      },
      amount: {
        value: '1',
        type: 'withdraw'
      },
      modal: false
    };
    const headerMenu = mount(<HeaderMenu {...props} />);

    expect(headerMenu.props().amount.value).to.equal('1');
    expect(headerMenu.props().amount.type).to.equal('withdraw');

    const onSubmit = sinon.spy();
    const form = mount(
      <Form type="withdraw" amount={props.amount} onSubmit={onSubmit} />
    );

    expect(form).to.have.length(1);
    expect(headerMenu.props().modal).to.equal(false);

    form.props().onSubmit();
    expect(onSubmit.called).to.equal(true);
  });
});

describe('Table', () => {
  it('renders columns', () => {
    const web3 = mockedCoinbaseWeb3();
    const props = {
      simExchange: {
        contract: ''
      },
      web3: {
        web3Instance: web3
      }
    };
    const table = mount(<Table {...props} />);

    table.setProps({
      simExchange: {
        contract: mockContract
      }
    });
  });
});
