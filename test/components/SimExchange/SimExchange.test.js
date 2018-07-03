import React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { mount } from 'enzyme';
import { Menu } from 'antd';
import { expect } from 'chai';
import sinon from 'sinon';

import SimExchange from '../../../src/components/SimExchange/SimExchange';
import Trades from '../../../src/components/SimExchange/Trades';
import Wallet from '../../../src/components/SimExchange/Wallet';

describe('SimExchange', () => {
  let simExchangeTrades;
  let simExchangeWallet;
  let simExchangeBadRoute;
  let getContractsSpy;

  const tradesPath = '/exchange/trades/';
  const walletPath = '/exchange/wallet/';

  const props = {
    asks: [],
    bids: [],
    simExchange: [],
    tradeOrder: {}
  };

  beforeEach(() => {
    getContractsSpy = sinon.spy();

    simExchangeBadRoute = mount(
      <MemoryRouter initialEntries={[{ pathname: '/test', key: 'start' }]}>
        <SimExchange
          asks={props.asks}
          bids={props.bids}
          getContracts={getContractsSpy}
          shouldRender={true}
          tradeOrder={props.tradeOrder}
        />
      </MemoryRouter>
    );

    simExchangeTrades = mount(
      <MemoryRouter initialEntries={[{ pathname: tradesPath, key: 'start' }]}>
        <SimExchange
          asks={props.asks}
          bids={props.bids}
          getContracts={getContractsSpy}
          shouldRender={true}
          tradeOrder={props.tradeOrder}
        />
      </MemoryRouter>
    );

    simExchangeWallet = mount(
      <MemoryRouter initialEntries={[{ pathname: walletPath, key: 'start' }]}>
        <SimExchange
          getContracts={getContractsSpy}
          simExchange={props.simExchange}
          shouldRender={true}
        />
      </MemoryRouter>
    );
  });

  it('contains menu items', () => {
    const component = simExchangeTrades.find(SimExchange);
    const menu = component.find(Menu);

    const hasTradesItem = menu.containsMatchingElement(
      <Menu.Item key="/exchange/trades/">
        <Link to="/exchange/trades/">Trades</Link>
      </Menu.Item>
    );

    const hasWalletItem = menu.containsMatchingElement(
      <Menu.Item key="/exchange/wallet/">
        <Link to="/exchange/wallet/">Wallet</Link>
      </Menu.Item>
    );

    expect(hasTradesItem, 'Should have trades menu item').to.be.true;
    expect(hasWalletItem, 'Should have wallet menu item').to.be.true;
  });

  it('renders trades', () => {
    const component = simExchangeTrades.find(SimExchange);
    const showsTrades = component.containsMatchingElement(
      <Trades
        asks={props.asks}
        bids={props.bids}
        tradeOrder={props.tradeOrder}
      />
    );

    expect(showsTrades, 'Should render trades').to.be.true;
  });

  it('renders wallet', () => {
    const component = simExchangeWallet.find(SimExchange);
    const showsWallet = component.containsMatchingElement(<Wallet />);

    expect(showsWallet, 'Should render wallet').to.be.true;
  });

  it('renders dummy text when disabled', () => {
    const component = mount(
      <MemoryRouter initialEntries={[{ tradesPath, key: 'start' }]}>
        <SimExchange getContracts={getContractsSpy} shouldRender={false} />
      </MemoryRouter>
    ).find(SimExchange);
    const showsDummy = component.containsMatchingElement(
      <strong>Coming soon...</strong>
    );

    simExchangeWallet.setProps({
      contracts: ['test'],
      contract: null
    });
    expect(showsDummy, 'Should render dummy text').to.be.true;
  });
});
