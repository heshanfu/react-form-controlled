import React, { PropTypes } from 'react';
import Element from './Element';

const DIFF_TIMEOUT = 100;

function fixUncontrolledValue(value) {
  return (typeof value === 'undefined' || value === null) ? '' : value;
}

function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export default class Input extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    autoComplete: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    autoComplete: 'off',
    type: 'text',
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: fixUncontrolledValue(props.value), // fix because null and undefined is uncontrolled
    };

    this.handleChange = this.handleChange.bind(this);
  }

  _clearChangeTimeout() {
    if (!this.timeoutId) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  handleChange(evn) {
    const target = evn.target || {};

    let value = target.type === 'checkbox'
      ? !!target.checked
      : target.value;

    if (target.type === 'number' && isNumeric(value)) {
      // fix decimal numbers
      const numberValue = Number(value);
      if (numberValue.toString() === value) {
        value = numberValue;
      }
    }

    this._clearChangeTimeout();
    this.setState({ value });

    const { originalProps, onChange } = this.props;

    if (typeof originalProps.onChange === 'function') {
      originalProps.onChange(value);
    }

    onChange(value, this);
  }

  componentWillReceiveProps(newProps) {
    const isDiff = this.state.value !== newProps.value;
    if (!isDiff) {
      return;
    }

    // wait for it
    this._clearChangeTimeout();
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      if (this.state.value === this.props.value) {
        return;
      }

      this.setState({
        value: fixUncontrolledValue(this.props.value),
      });
    }, DIFF_TIMEOUT);
  }

  componentWillUnmount() {
    this._clearChangeTimeout();
  }

  render() {
    const { type, originalProps, value, currentValue, name } = this.props;
    const checked = (type === 'checkbox' && value)
      || (type === 'radio' && value === currentValue);

    return (
      <input
        {...originalProps}
        name={name}
        onChange={this.handleChange}
        checked={checked ? checked : void 0}
        value={this.state.value} />
    );
  }
}
