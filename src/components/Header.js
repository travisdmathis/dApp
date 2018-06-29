import { Affix, Menu } from 'antd';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import logo from '../img/market-logo-white.png';
import '../less/Header.less';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const subMenuItems = [
  { name: 'Simplified Deploy', to: '/contract/deploy?mode=simplified' },
  { name: 'Guided Deploy', to: '/contract/deploy?mode=guided' },
  { name: 'Quick Deploy', to: '/contract/deploy?mode=quick' }
];

const mainMenuItems = [
  { name: 'Explore Contracts', to: '/contract/explorer' },
  { name: 'Find Contracts', to: '/contract/find' },
  { name: 'Test Query', to: '/test' },
  {
    name: 'Documentation',
    to: 'http://docs.marketprotocol.io',
    target: '_blank'
  }
];

class Header extends Component {
  render() {
    const path = this.props.location.pathname + this.props.location.search;

    return (
      <Affix>
        <header id="header" className="clearfix">
          <div className="ant-row">
            <div className="ant-col-xs-24 ant-col-sm-24 ant-col-md-6 ant-col-lg-5 ant-col-xl-5 ant-col-xxl-4">
              <Link to="/" id="logo">
                <img src={logo} alt="Market Protocol Logo" />
              </Link>
            </div>
            <div className="ant-col-xs-0 ant-col-sm-0 ant-col-md-18 ant-col-lg-19 ant-col-xl-19 ant-col-xxl-20">
              <Menu
                mode="horizontal"
                className="menu-site"
                id="nav"
                selectedKeys={[path]}
              >
                <SubMenu title="Deploy Contracts">
                  {subMenuItems.map(item => (
                    <MenuItem key={item.to}>
                      <Link to={item.to}>{item.name}</Link>
                    </MenuItem>
                  ))}
                </SubMenu>
                {mainMenuItems.map(item => (
                  <MenuItem key={item.to}>
                    <Link to={item.to} target={item.target}>
                      {item.name}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </header>
      </Affix>
    );
  }
}

export default withRouter(Header);
