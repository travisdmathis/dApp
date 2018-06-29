export default [
  {
    title: 'Amount',
    dataIndex: 'orderQty',
    key: 'orderQty',
    render: text => Math.abs(text)
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  }
];
