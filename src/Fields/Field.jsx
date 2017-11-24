import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isset, fieldUtils } from '../utils';

export const defaultProps = {
  type: 'text',
  expected: true,
  value: '',
  required: false,
  disabled: false
};

export default class Field extends Component {
  static propTypes = {
    /* General */
    id: PropTypes.string,
    className: PropTypes.string,

    /* Specific */
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,

    /* Validation */
    validated: PropTypes.bool,
    valid: PropTypes.bool,
    rule: PropTypes.instanceOf(RegExp),
    asyncRule: PropTypes.func,

    /* States */
    required: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
  }

  static defaultProps = defaultProps

  static contextTypes = {
    fields: PropTypes.instanceOf(Map).isRequired,
    mapFieldToState: PropTypes.func.isRequired,
    handleFieldFocus: PropTypes.func.isRequired,
    handleFieldBlur: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired
  }

  /**
   * Get prop.
   * Gets the given prop name from the context first, otherwise tries to resolve the prop.
   * In case both return undefined, fallbacks to the default prop value.
   */
  getProp(propName) {
    const { fields } = this.context;
    const contextValue = fields.getIn([this.props.name, propName]);
    const propValue = isset(contextValue) ? contextValue : this.props[propName];

    if (typeof propValue !== 'function') return propValue;

    const resolvedPropValue = fieldUtils.resolveProp({ propName, fieldProps: this.props, fields });
    return resolvedPropValue || defaultProps[propName];
  }

  componentDidMount() {
    console.warn('Field @ mount');
    /**
     * Map the field to Form's state to notify the latter of the new registered field.
     * Timeout is required because {componentDidMount} happens at the same time for all
     * fields inside the composite component. Thus, each field is updating the state
     * based on its value upon the composite mount. This causes issues of missing fields.
     */
    setTimeout(() => {
      this.context.mapFieldToState({
        fieldProps: {
          ...this.props,
          validated: false
        },
        fieldComponent: this
      });
    }, 0);
  }

  handleChange = (event) => {
    const { value: prevValue } = this.props;
    const { value: nextValue } = event.currentTarget;

    // console.log(' ');
    // console.log('| | Field @ handleChange', this.props.name, nextValue);

    /* Call parental change handler */
    this.context.handleFieldChange({
      event,
      fieldProps: this.props,
      nextValue,
      prevValue
    });
  }

  /**
   * Handle field focus.
   * Bubble up to the Form to mutate the state of this particular field,
   * setting its "focus" property to the respective value.
   */
  handleFocus = (event) => {
    this.context.handleFieldFocus({
      event,
      fieldProps: this.props
    });
  }

  /**
   * Handle field blur.
   */
  handleBlur = (event) => {
    const { value } = event.currentTarget;
    const fieldProps = Object.assign({}, this.props, { value });

    this.context.handleFieldBlur({ event, fieldProps });
  }

  render() {
    /* Props passed to <Field /> on the client usage */
    const { name, rule, asyncRule, valid, invalid, expected, validated, ...directProps } = this.props;

    /**
     * Input props.
     * Props passed directly to the Field's element. Do not add
     * properties which are not natively supported by that element.
     */
    const inputProps = {
      value: this.getProp('value'),
      required: this.getProp('required'),
      disabled: this.getProp('disabled'),
    };

    /**
     * Event handlers assigned to the Field's element directly.
     * Those handle changes which mutate the internal state/context.
     */
    const eventHandlers = {
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };

    return (
      <input {...directProps} {...inputProps} {...eventHandlers} />
    );
  }
}
