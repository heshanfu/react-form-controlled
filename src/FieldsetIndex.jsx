import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';

export default class FieldsetIndex extends Element {
  static propTypes = {
    render: PropTypes.func,
    children: PropTypes.func,
  };

  render() {
    const parent = this.getParent();
    const index = Number(parent.props.name);
    const { children, render, ...rest } = this.props;
    const newProps = {
      index,
    };

    if (typeof children === 'function') {
      return this.replaceChildren(children(newProps));
    } else if (typeof render === 'function') {
      return this.replaceChildren(render(newProps));
    }

    if (!children) {
      return (
        <span {...rest}>{`${index + 1}.`}</span>
      );
    }

    return this.replaceChildren(cloneElement(children, newProps));
  }
}
