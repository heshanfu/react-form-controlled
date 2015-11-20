import React, { PropTypes } from 'react';
import Ajv from 'ajv';
import FormObject from './FormObject';

const DEFAULT_INVALID_ERROR = 'Form is invalid';

export default class Form extends FormObject {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func,
    ajvOptions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    ajvOptions: {
      allErrors: true,
    }
  };

  constructor(props, context) {
    super(props, context);

    this.errors = []

    const ajv = Ajv(props.ajvOptions);
    this.validateData = ajv.compile(props.schema || {});
  }

  validate(callback) {
    this.errors = [];

    const schema = this.props.schema;
    if (!schema) {
      return callback(null, true);
    }

    const isValid = this.validateData(this.props.value);
    if (isValid) {
      return callback(null, true);
    }

    const errors = this.errors = this.validateData.errors || [];
    errors.forEach((err) => {
      if (!err.dataPath) {
        return;
      }

      err.path = err.dataPath.substr(1);
    });

    const err = new Error(DEFAULT_INVALID_ERROR);
    err.errors = errors;

    callback(err);
  }

  getErrors(path) {
    const errors = this.errors;
    if (!path) {
      return errors;
    }

    const ret = [];

    for (let index = 0; index < errors.length; index++) {
      const error = errors[index];
      if (error.path !== path) {
        continue;
      }

      ret.push(error);
    }
    return ret;
  }

  hasErrors(path) {
    return !!this.getErrors(path).length;
  }

  isValid(path) {
    return !this.hasErrors(path);
  }

  handleSubmit(evn) {
    evn.preventDefault();

    this.validate((err) => {
      if (err) {
        if (this.props.onError) {
          this.props.onError(err);
        }

        //redraw for ErrorAlert
        this.setState({
          error: err,
        });

        return;
      }

      this.setState({
        error: null,
      });

      this.props.onSubmit(this.props.value);
    });
  }

  handleChange(evn) {
    this.errors = [];

    this.super(evn);
  }

  render() {
    const children = this._registerChildren(this.props.children);
    const autoComplete = typeof this.props.autoComplete !== 'undefined'
      ? this.props.autoComplete
      : 'off';

    return (
      <form
        autoComplete={autoComplete}
        method={this.props.method}
        action={this.props.action}
        className={this.props.className || 'form'}
        onSubmit={this.handleSubmit.bind(this)}
        onChange={this.handleChange.bind(this)}>
        {children}
      </form>
    );
  }
}
