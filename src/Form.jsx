import { createElement } from 'react';
import PropTypes from 'prop-types';
import Fieldset from './Fieldset';

export default class Form extends Fieldset {
  static propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    skipReplace: PropTypes.bool,
    value: PropTypes.any, // eslint-disable-line
    method: PropTypes.string,
    action: PropTypes.string,
    autoComplete: PropTypes.string,
    children: PropTypes.node,
    tagName: PropTypes.string.isRequired,
    debounce: PropTypes.number,
    validate: PropTypes.func,
    sameChildren: PropTypes.bool,
    defaultValue: PropTypes.any, // eslint-disable-line
    enableReinitialize: PropTypes.bool,
    ignoreParent: PropTypes.bool,
  };

  static defaultProps = {
    autoComplete: 'off',
    tagName: 'form',
    debounce: 250,
    enableReinitialize: false,
    ignoreParent: false,
  };

  static childContextTypes = {
    fieldset: PropTypes.object.isRequired,
  };

  static contextTypes = {
    fieldset: PropTypes.object,
  };

  constructor(...args) {
    super(...args);

    this.defaultValue = this.props.defaultValue;
  }

  getCurrentValue(props) {
    const { defaultValue } = this;
    const { value } = props;

    return defaultValue !== undefined
      ? defaultValue
      : value;
  }

  componentWillReceiveProps(props) {
    // reinit default value
    const { enableReinitialize, defaultValue } = props;
    if (enableReinitialize && defaultValue !== this.props.defaultValue) {
      this.defaultValue = defaultValue;
    }

    const value = this.getCurrentValue(props);
    this.setValue(value, this, true);
  }

  getPath() {
    return undefined;
  }

  getOriginalValue() {
    return this.getCurrentValue(this.props);
  }

  getParent() {
    const { ignoreParent } = this.props;
    if (ignoreParent) {
      return undefined;
    }

    return super.getParent();
  }

  getForm() {
    const { ignoreParent } = this.props;
    if (ignoreParent) {
      return this;
    }

    const parent = this.getParent();
    return parent
      ? parent.getForm()
      : this;
  }

  getErrors(path, exactMatch) {
    const errors = this.errors || [];
    if (!path) {
      return errors;
    }

    const parentPath = `${path}.`;

    return errors.filter((error) => {
      if (!error.path) {
        return false;
      }

      if (error.path === path) {
        return true;
      }

      if (!exactMatch && error.path.indexOf(parentPath) === 0) {
        return true;
      }

      return false;
    });
  }

  hasErrors(path, exact) {
    return !!this.getErrors(path, exact).length;
  }

  isValid(path, exact) {
    return !this.hasErrors(path, exact);
  }

  onSubmit = async (evn) => {
    evn.preventDefault();

    if (this.working) {
      return;
    }

    this.working = true;
    this.notifyChildren();

    const { onSubmit, onError, validate } = this.props;
    const value = this.getValue();

    this.errors = validate
      ? await validate(value)
      : [];

    const { errors } = this;

    if (!errors.length && onSubmit) {
      await onSubmit(value);
    } else if (errors && errors.length && onError) {
      await onError(errors, value);
    }

    this.working = false;
    this.notifyChildren();
  }

  isWorking() {
    return !!this.working;
  }

  setValue(value, component, notifyChildren) {
    this.clearErrors();

    super.setValue(value, component, notifyChildren);
  }

  clearErrors() {
    this.errors = [];
  }

  getClassName() {
    const { className, tagName } = this.props;
    return className || tagName;
  }

  render() {
    const {
      autoComplete, tagName, children, method, action,
    } = this.props;

    const props = tagName === 'form' ? {
      autoComplete,
      method,
      action,
      className: this.getClassName(),
      onSubmit: this.onSubmit,
    } : {
      className: this.getClassName(),
    };

    return createElement(tagName, props, this.processChildren(children));
  }
}
