import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Wallet from '../../../src/components/SimExchange/Wallet';
import Table from '../../../src/components/SimExchange/WalletComponents/Table';
import { T } from 'antd';
import Columns from '../../../src/components/SimExchange/WalletComponents/Columns';
import HeaderMenu from '../../../src/components/SimExchange/WalletComponents/HeaderMenu';
import { Button, Popover } from 'antd';

import data from '../../../src/components/SimExchange/data/wallet';

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

describe('Table', () => {
  const component = shallow(<Table />);

  const containsTable = component.containsMatchingElement(<T />);

  expect(containsTable, 'Should render transaction table').to.be.true;
});
