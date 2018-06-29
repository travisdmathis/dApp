import React, { Component, Fragment } from 'react';
import Form from './TradeComponents/Form';
import Table from './TradeComponents/Table';
import uniqueId from 'lodash/uniqueId';

import { Modal, Table as AntTable } from 'antd';

import columns from './Columns';

class Buy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {},
      modal: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  onSubmit(order) {
    this.setState({ order });
  }

  onRowSelect(order) {
    this.setState({ order });
  }

  showModal() {
    this.setState({ modal: true });
  }

  handleCancel() {
    this.setState({ modal: false });
  }

  handleOk() {
    this.props.tradeOrder(this.state.order);
    this.setState({ modal: false });
  }

  render() {
    const { order } = this.state;
    let title = '';

    if (order && order.title) {
      title = order.title.toLowerCase();
    }

    return (
      <Fragment>
        <div className="tradeForm-container" style={{ marginBottom: '20px' }}>
          <Form
            title={this.props.title}
            market={this.props.market}
            onSubmit={this.onSubmit}
            showModal={this.showModal}
            order={order}
          />
        </div>

        <Table
          data={this.props.data}
          title={`${this.props.title}s`}
          onRowSelect={this.onRowSelect}
        />

        <Modal
          title="Confirmation required"
          visible={this.state.modal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h3>
            Are you sure you want to {title} {order.amount} {order.market} at{' '}
            {order.price} ETX/ETH for a maximum of {order.total} ETH?
          </h3>

          <AntTable
            rowKey={() => uniqueId('row')}
            pagination={false}
            size="small"
            columns={columns}
            dataSource={[order]}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default Buy;
