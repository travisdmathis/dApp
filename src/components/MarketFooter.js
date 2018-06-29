import React, { Component } from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { Link } from 'react-router-dom';

// Styles
import '../less/MarketFooter.less';

import logoImg from '../img/footer/logo_light.svg';
import telegram from '../img/footer/telegram.svg';
import twitter from '../img/footer/twitter.svg';
import medium from '../img/footer/medium.svg';
import github from '../img/footer/github.svg';
import youtube from '../img/footer/youtube.svg';

const { Footer } = Layout;

class MarketFooter extends Component {
  render() {
    return (
      <Footer
        style={{ color: '#fff', backgroundColor: '#11161c', padding: '0px' }}
      >
        <div className="footer-wrapper">
          <Row type="flex" align="top">
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ marginBottom: '60px' }}
              className="footer-content"
            >
              <img alt="Bitcoin derivatives and shorting" src={logoImg} />
              <p className="footer-description">
                MARKET Protocol provides the open source building blocks
                powering decentralized derivatives trading and exchanges on the
                Ethereum blockchain.
              </p>
              <div style={{ marginTop: '35px' }}>
                <Link to="https://t.me/Market_Protocol_Chat" target="_blank">
                  <Button className="icon-button" size="small" type="primary">
                    <img
                      alt="crypto derivatives telegram"
                      src={telegram}
                      width="80%"
                    />
                  </Button>
                </Link>
                <Link to="https://twitter.com/MarketProtocol/" target="_blank">
                  <Button className="icon-button" size="small" type="primary">
                    <img
                      alt="decentralized exchange twitter"
                      src={twitter}
                      width="80%"
                    />
                  </Button>
                </Link>
                <Link to="https://medium.com/market-protocol" target="_blank">
                  <Button className="icon-button" size="small" type="primary">
                    <img
                      alt="ethereum derivatives medium"
                      src={medium}
                      width="80%"
                    />
                  </Button>
                </Link>
                <Link to="https://github.com/MARKETProtocol/" target="_blank">
                  <Button className="icon-button" size="small" type="primary">
                    <img
                      alt="open source ethereum dApp"
                      src={github}
                      width="80%"
                    />
                  </Button>
                </Link>
                <Link
                  to="https://www.youtube.com/c/MARKETProtocol"
                  target="_blank"
                >
                  <Button className="icon-button" size="small" type="primary">
                    <img
                      alt="trading any assets youtube"
                      src={youtube}
                      width="80%"
                    />
                  </Button>
                </Link>
              </div>
              <p className="copyright-text">
                <span style={{ marginTop: '35px', display: 'block' }}>
                  ©2018 Market Protocol, LLC
                </span>
              </p>
            </Col>
            <Col xs={12} sm={8} md={4} lg={4} xl={4}>
              <h3 className="footer-link-category">Documentation</h3>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/assets/MARKET_Protocol-Whitepaper.pdf"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Whitepaper
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/assets/MARKET_Protocol-Summary.pdf"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Summary
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://github.com/MARKETProtocol"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Github
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://docs.marketprotocol.io/"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Technical Docs
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://docs.marketprotocol.io/#faq-general"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  FAQ
                </Link>
              </p>
            </Col>
            <Col xs={12} sm={8} md={4} lg={4} xl={4}>
              <h3 className="footer-link-category">Community</h3>
              <p className="footer-link">
                <Link
                  to="https://t.me/Market_Protocol_Chat"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Telegram
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://twitter.com/MarketProtocol"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Twitter
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://medium.com/market-protocol"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Medium
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://discordapp.com/invite/qN8MCbq"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Discord
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/press"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Press
                </Link>
              </p>
            </Col>
            <Col xs={8} sm={8} md={4} lg={4} xl={4}>
              <h3 className="footer-link-category">Organization</h3>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/team"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Team
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/partners"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Partners
                </Link>
              </p>
              <p className="footer-link">
                <Link
                  to="https://marketprotocol.io/jobs"
                  target="_blank"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  Jobs (We're hiring!)
                </Link>
              </p>
              <p>4450 Arapahoe Ave, Suite 100 Boulder, CO 80303</p>
              <p className="footer-link">
                <Link
                  to="mailto:info@marketprotocol.io"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  info@marketprotocol.io
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </Footer>
    );
  }
}

export default MarketFooter;
