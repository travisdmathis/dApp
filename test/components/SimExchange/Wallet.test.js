import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Web3 from 'web3';
import FakeProvider from 'web3-fake-provider';
import { Input, Modal } from 'antd';
import { Table as T } from 'antd';
import { Market } from '@marketprotocol/marketjs';
import BigNumber from 'bignumber.js';
import abi from 'human-standard-token-abi';
import Wallet from '../../../src/components/SimExchange/Wallet';
import Table from '../../../src/components/SimExchange/WalletComponents/Table';
import Columns from '../../../src/components/SimExchange/WalletComponents/Columns';
import HeaderMenu from '../../../src/components/SimExchange/WalletComponents/HeaderMenu';
import Form from '../../../src/components/SimExchange/WalletComponents/Form';
import sinon from 'sinon';

const mockContract = {
  key: '0x6467854f25ff1f1ff8c11a717faf03e409b53635',
  CONTRACT_NAME: 'ETHXBT',
  COLLATERAL_TOKEN: 'FakeDollars',
  COLLATERAL_TOKEN_ADDRESS: '0x6467854f25ff1f1ff8c11a717faf03e409b53635',
  COLLATERAL_TOKEN_SYMBOL: 'FUSD',
  MARKET_COLLATERAL_POOL_ADDRESS: new BigNumber(),
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

function mockedCoinbaseWeb3(
  callbackError = null,
  coinbaseAddress = '0x6467854f25ff1f1ff8c11a717faf03e409b53635'
) {
  const fakeProvider = new FakeProvider();
  const web3 = new Web3(fakeProvider);
  fakeProvider.injectResult(['0x98765']);
  web3.eth.getCoinbase = callback => {
    callback(callbackError, coinbaseAddress);
  };
  web3.fromWei = () => {
    return new BigNumber(5);
  };

  return web3;
}

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
  let headerMenu;
  let form;
  let onSubmit;
  let showModal;
  let validateFields;
  let props;
  let getFieldDecorator;
  let getFieldError;
  let isFieldTouched;
  let getFieldsError;
  let showMessage;

  beforeEach(() => {
    const web3 = mockedCoinbaseWeb3();
    onSubmit = sinon.spy();
    showModal = sinon.spy();
    validateFields = sinon.spy();
    getFieldDecorator = sinon.spy();
    getFieldError = sinon.spy();
    isFieldTouched = sinon.spy();
    getFieldsError = sinon.spy();
    showMessage = sinon.spy();

    props = {
      amount: {
        type: 'deposit',
        value: '1'
      },
      simExchange: {
        contract: ''
      },
      web3: {
        web3Instance: web3
      },
      form: {
        validateFields: validateFields,
        isFieldTouched: isFieldTouched,
        getFieldDecorator: getFieldDecorator,
        getFieldError: getFieldError,
        getFieldsError: getFieldsError
      },
      showModal: showModal,
      onSubmit: onSubmit,
      type: 'deposit',
      showMessage: showMessage
    };

    headerMenu = mount(<HeaderMenu {...props} />);
  });

  it('contains a form', () => {
    const containsForm = headerMenu.containsMatchingElement(<Form />);

    expect(containsForm, 'Should render deposit/withdraw form').to.be.true;
  });

  it('should have a input field to accept deposits', () => {
    form = headerMenu.find('.deposit-form');
    expect(form.find(Input)).to.have.length(1);
  });

  it('should have a input field to accept withdraw', () => {
    form = headerMenu.find('.withdraw-form').first();
    expect(form.find(Input)).to.have.length(1);
  });

  it('should getBalances when a contract is selected', () => {
    let spy = sinon.spy(headerMenu.instance(), 'getBalances');

    headerMenu.update();

    headerMenu.setProps({
      simExchange: {
        contract: mockContract
      }
    });

    expect(spy.called).to.equal(true);
  });

  it('should update amount and submit request', () => {
    const amount = {
      type: 'deposit',
      value: '1'
    };

    let input = headerMenu.find('.deposit-input').first();
    input.value = '1';
    input.simulate('change');

    let form = headerMenu.find('.deposit-form').first();
    let spy = sinon.spy(headerMenu.instance(), 'onSubmit');
    headerMenu.update();

    form.simulate('submit');
    headerMenu.instance().onSubmit(amount);
    expect(spy.called).to.equal(true);
  });

  it('should open collateral modal', () => {
    let spy = sinon.spy(headerMenu.instance(), 'showModal');
    headerMenu.update();

    headerMenu.instance().showModal();

    expect(headerMenu.state('modal')).to.equal(true);
    expect(spy.called).to.equal(true);
  });

  it('should close collateral modal', () => {
    let spy = sinon.spy(headerMenu.instance(), 'handleCancel');
    headerMenu.update();

    headerMenu.instance().handleCancel();

    expect(headerMenu.state('modal')).to.equal(false);
    expect(spy.called).to.equal(true);
  });

  it('should handleOk default', () => {
    let spy = sinon.spy(headerMenu.instance(), 'handleOk');

    headerMenu.update();
    headerMenu.instance().onSubmit({ type: 'test', value: '1' });

    headerMenu.instance().handleOk();

    expect(headerMenu.state('modal')).to.equal(false);
    expect(spy.called).to.equal(true);
  });

  it('should handleOk deposit', () => {
    let spy = sinon.spy(headerMenu.instance(), 'handleOk');
    headerMenu.setProps({
      simExchange: {
        contract: mockContract
      }
    });
    const depositCollateral = sinon.spy();
    headerMenu.instance().depositCollateral = depositCollateral;
    headerMenu.update();

    headerMenu.instance().onSubmit({ type: 'deposit', value: '1' });
    headerMenu.instance().handleOk();

    expect(headerMenu.state('modal')).to.equal(false);
    expect(spy.called).to.equal(true);
    expect(depositCollateral.called).to.equal(true);
  });

  it('should handleOk withdraw', () => {
    let spy = sinon.spy(headerMenu.instance(), 'handleOk');
    headerMenu.setProps({
      simExchange: {
        contract: mockContract
      }
    });

    headerMenu.update();
    headerMenu.instance().onSubmit({ type: 'withdraw', value: '1' });

    headerMenu.instance().handleOk();

    headerMenu.props().showMessage('success', 'test');

    expect(headerMenu.state('modal')).to.equal(false);
    expect(spy.called).to.equal(true);
  });

  describe('Table', () => {
    it('renders with transaction data', () => {
      const table = mount(<Table {...props} />);

      const containsDataTable = table.containsMatchingElement(<T />);

      table.setProps({
        simExchange: {
          contract: mockContract
        }
      });
    });
  });
});
