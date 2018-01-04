import React from 'react';
import createField from '../createField';

function Radio(props) {
  return (<input { ...props } />);
}

export default createField({
  /**
   * Handling of contextProps of  Radio inputs' is unique.
   * 1. Never pass "props.value" to context. <Field.Radio> is always expected to receive a "value" prop,
   * however it should never set it to context on registration. The value in the context will be changed
   * according to the onChange handlers in the future.
   * 2. Determine "initialValue" based on optional "checked" prop.
   * 3. Add new "checked" props unique to this field type.
   */
  mapPropsToField: (props) => {
    const { checked, value } = props;

    const fieldProps = {
      ...props,
      value: checked ? value : null // other radio inputs are not mutating the conext value
    };

    if (checked) {
      fieldProps.checked = checked;

      if (value) {
        /* Only checked radio will set the context value to its own value */
        fieldProps.initialValue = value;
        delete fieldProps.value;
      }
    }

    return fieldProps;
  },
  enforceProps: (props, contextProps) => ({
    type: 'radio',
    checked: (props.value === contextProps.get('value'))
  })
})(Radio);
