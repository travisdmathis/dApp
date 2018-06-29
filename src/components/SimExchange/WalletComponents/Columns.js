import React from 'react';
import { Button, Popover } from 'antd';

export default [
  {
    title: 'Block #',
    dataIndex: 'block',
    key: 'block'
  },
  {
    title: 'In / Out',
    key: 'inout',
    render: (text, record) => (
      <span className={`action action-${text.inout}`}>{text.inout}</span>
    )
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'From / To',
    key: 'addresses',
    render: (text, record) => (
      <div>
        <div>{text.addresses.from}</div>
        <div>{text.addresses.to}</div>
      </div>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: '',
    key: 'details',
    render: (text, record) => (
      <Popover
        placement="left"
        trigger="click"
        content={
          <div className="popover-content">
            <div className="details">
              <div className="details-header">Hash:</div>
              <div title={text.details.hash} className="details-info">
                {text.details.hash}
              </div>
            </div>
            <div className="details">
              <div className="details-header">Trade id:</div>
              <div title={text.details.id} className="details-info">
                {text.details.id}
              </div>
            </div>
          </div>
        }
      >
        <Button>Details</Button>
      </Popover>
    )
  }
];
