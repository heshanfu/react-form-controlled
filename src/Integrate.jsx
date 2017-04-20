import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Element from './Element';

export default class Integrate extends Element {
  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    value: PropTypes.string,
  };

  static defaultProps = {
    onChange: 'onChange',
    value: 'value',
  };

  render() {
    const { children, onChange, value, name } = this.props;
    const newProps = {
      name,
    };

    if (typeof onChange === 'string') {
      newProps[onChange] = (...args) => this.setValue(...args);
    }

    if (value) {
      newProps[value] = this.getValue();
    }

    return cloneElement(children, newProps);
  }
}
