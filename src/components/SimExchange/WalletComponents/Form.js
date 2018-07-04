import React, { Component } from 'react';
import capitalize from 'lodash/capitalize';
import { Form as AntForm, Input, Button } from 'antd';

const FormItem = AntForm.Item;

class Form extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.form.validateFields();
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.showModal();
        this.props.onSubmit({ ...values, type: this.props.type });
      }
    });
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { form } = this.props;
    let { type } = this.props;

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      getFieldsError
    } = form;

    const numberError = isFieldTouched('number') && getFieldError('number');
    type = capitalize(type);

    return (
      <AntForm onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={numberError ? 'error' : ''}
          help={numberError || ''}
        >
          {getFieldDecorator('number', {
            rules: [{ required: true, message: 'Please enter a number' }]
          })(
            <Input
              addonAfter={this.props.collateralToken}
              type="number"
              min="0"
              step="0.001"
              placeholder="10.000"
              size="large"
              className={
                type === 'Deposit' ? 'deposit-input' : 'withdraw-input'
              }
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            disabled={this.hasErrors(getFieldsError())}
            htmlType="submit"
            type="primary"
            style={{ width: '100%' }}
            className={
              type === 'Deposit' ? 'deposit-button' : 'withdraw-button'
            }
          >
            {type}
          </Button>
        </FormItem>
      </AntForm>
    );
  }
}

const WrappedForm = AntForm.create({
  mapPropsToFields({ amount }) {
    return {
      number: AntForm.createFormField({
        value: amount && amount.value
      })
    };
  }
})(Form);

export default WrappedForm;
