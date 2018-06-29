import React, { Component } from 'react';
import { Form, Input, Card, Button } from 'antd';

const FormItem = Form.Item;

const title = {
  ask: 'Sell',
  bid: 'Buy'
};

class BuyForm extends Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.form.validateFields();
    });
  }

  handleSubmit(e) {
    const { form, market, order } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err && order.orderHash) {
        this.props.showModal();
        this.props.onSubmit({
          ...values,
          market,
          title: title[this.props.title],
          ...order
        });
      }
    });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { form } = this.props;
    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      getFieldsError
    } = form;

    const amountError = isFieldTouched('amount') && getFieldError('amount');
    const priceError = isFieldTouched('price') && getFieldError('price');

    return (
      <Card title={`${title[this.props.title]} ${this.props.market}`}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            validateStatus={amountError ? 'error' : ''}
            help={amountError || ''}
          >
            {getFieldDecorator('amount', {
              rules: [{ required: true, message: 'Please enter an amount' }]
            })(<Input addonAfter="ETH" type="number" placeholder="Amount" />)}
          </FormItem>
          <FormItem
            validateStatus={priceError ? 'error' : ''}
            help={priceError || ''}
          >
            {getFieldDecorator('price', {
              rules: [{ required: true, message: 'Please enter a price' }]
            })(
              <Input
                addonAfter="ETX"
                disabled={true}
                type="number"
                placeholder="Price"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              disabled={this.hasErrors(getFieldsError())}
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              {title[this.props.title]}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

const WrappedForm = Form.create({
  mapPropsToFields({ order }) {
    return {
      amount: Form.createFormField({
        value: order.orderQty ? Math.abs(order.orderQty) : ''
      }),
      price: Form.createFormField({
        value: order.price
      }),
      market: Form.createFormField({
        value: order.market
      }),
      type: Form.createFormField({
        value: order.type
      })
    };
  }
})(BuyForm);

export default WrappedForm;
