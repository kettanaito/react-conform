import React, { Component } from 'react';
import { FormProvider, Form, Field } from '../src';
import MyInput from './templates/MyInput';
import MySelect from './templates/MySelect';

/* Form validation rules */
const formRules = {
  name: {
    username: value => (value === 'ab123')
  }
};

/* Composite field example */
const FieldsComposition = () => (
  <div style={{ display: 'flex' }}>
    <MyInput name="address" value="Baker" />
    <MyInput name="street" value="12/c" />
  </div>
);

export default class DefaultForm extends Component {
  handleFormAction = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  handleSubmitStart = ({ fields, serialized, formProps }) => {
    console.warn('handleSubmitStart');
    console.log('fields', fields.toJS());
    console.log('serialized', serialized.toJS());
    console.log('formProps', formProps);
    alert('SUBMITS');
  }

  handleSubmitEnd = ({ fields, serialized, formProps }) => {
    console.warn('handleSubmitEnd');
    console.log('fields', fields.toJS());
    console.log('serialized', serialized.toJS());
    console.log('formProps', formProps);
  }

  render() {
    return (
      <FormProvider rules={ formRules }>
        <Form
          id="default-form-example"
          action={this.handleFormAction}
          onSubmitStart={this.handleSubmitStart}
          onSubmitEnd={this.handleSubmitEnd}>
          <div className="field-group">
            {/* Select */}
            {/* <label>
              Select example:
              <Field.Select name="choice">
                <option>Foo</option>
                <option>Two</option>
              </Field.Select>
            </label> */}

            {/* Input */}
            <label>
              Filed with client rule (optional):
              <MyInput
                onBlur={ args => console.log(args) }
                onChange={ args => console.log(args) }
                name="numbersOnly"
                placeholder="i.e. 123"
                rule={/^\d+$/}
                value="Initial value" />
            </label>

            {/* <label>
              Field (required):
              <MyInput
                name="password"
                required />
            </label> */}

            <label>
              Field (async-rule)
              <MyInput
                name="username"
                asyncRule={({ fieldProps }) => {
                  return fetch('http://demo9102997.mockable.io/validate/productId', {
                    method: 'POST',
                    body: JSON.stringify({
                      userName: fieldProps.value
                    })
                  });
                }}
                required />
            </label>

            <label>
              Field with resolvable prop (required)
              <MyInput
                name="resolvableField"
                required={({ fields }) => {
                  return fields.address && !!fields.address.value;
                }} />
            </label>

            <label>
              Composite field:
              <FieldsComposition />
            </label>
          </div>
          <button type="submit">Submit</button>
        </Form>
      </FormProvider>
    );
  }
}
