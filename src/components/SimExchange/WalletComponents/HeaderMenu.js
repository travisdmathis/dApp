import React, { Component } from 'react';

import { Card, Row, Modal, Col } from 'antd';

import Form from './Form';

class HeaderMenu extends Component {
  constructor() {
    super();

    this.state = {
      amount: {},
      transaction: {}
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
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

    return (
      <Row gutter={24} className="header-menu">
        <Col span={12}>
          <Card title="Deposit">
            <Form
              onSubmit={this.onSubmit}
              showModal={this.showModal}
              type="deposit"
              amount={amount}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Withdraw">
            <Form
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
            Are you sure you want to {amount.type} {amount.number} ETX?
          </h3>
        </Modal>
      </Row>
    );
  }
}

export default HeaderMenu;
