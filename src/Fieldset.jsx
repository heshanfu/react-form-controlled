import React, { PropTypes, cloneElement } from 'react';
import Element from './Element';
import isArray from 'lodash/lang/isArray';
import isFunction from 'lodash/lang/isFunction';
import set from 'lodash/object/set';
import get from 'lodash/object/get';
import forOwn from 'lodash/object/forOwn';
import traverse from './utils/traverse';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';

function extendCallbacks(child, index) {
  const props = child.props;

  if (typeof index === 'undefined' || props['data-extended']) {
    return child;
  }

  const newProps = {};
  let extendedCount = 0;

  forOwn(props, (fn, key) => {
    if (typeof fn !== 'function' || fn._extended) {
      return;
    }

    extendedCount++;

    const newFn = (...args) => fn(index, ...args);
    newFn._extended = true;

    newProps[key] = newFn;
  });

  if (extendedCount) {
    newProps['data-extended'] = true;
    const newChild = cloneElement(child, newProps);
    return newChild;
  }

  return child;
}

export default class Fieldset extends Element {
  static isElement = true;

  static propTypes = {
    ...Element.propTypes,
    onChange: PropTypes.func,
    map: PropTypes.bool.isRequired,
    index: PropTypes.number,
    addIndex: PropTypes.bool,
    valueIndex: PropTypes.bool,
  };

  static defaultProps = {
    map: true,
  };

  shouldComponentUpdate(nextProps) {
    const props = this.props;

    return ( props.name !== nextProps.name
      || props.className !== nextProps.className
      || props.value !== nextProps.value
      || props.map !== nextProps.map
      || props.index !== nextProps.index
      || props.addIndex !== nextProps.addIndex
      || props.valueIndex !== nextProps.valueIndex);
  }

  resolveByPath(path, callback) {
    if (typeof path === 'undefined' || path === null || path === '') {
      if (typeof this.props.index !== 'undefined') {
        if (!this.props.parent) {
          return callback(new Error('Parent is undefined'));
        }

        return this.props.parent.resolveByPath(this.props.index, callback);
      }

      return callback(new Error('Path is undefined'));
    }

    if (path && path[0] === '.') {
      const { parent, index } = this.props;
      if (!parent) {
        return callback(new Error('Parent is undefined'));
      }

      const hasIndex = typeof index !== 'undefined';
      const realParent = hasIndex ? parent.props.parent : parent;
      if (!parent) {
        return callback(new Error('Parent is undefined'));
      }

      return realParent.resolveByPath(path.substr(1), callback);
    }

    return callback(null, this, path);
  }

  getValue(path, valueIndex) {
    if (typeof path === 'undefined' || path === null || path === '') {
     return valueIndex ? this.props.index : this.props.value;
    }

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return void 0;
      }

      const { value = {} } = current.props;
      return get(value, subPath);
    });
  }

  setValue(path, value, component) {/*
    if (typeof path === 'undefined' && typeof this.props.index !== 'undefined') {
      return this.props.parent.setValue(this.props.index, value, component);
    }*/

    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return;
      }

      const currentValue = current.props.value;
      const newState = isArray(currentValue)
        ? [...currentValue]
        : {...currentValue};


      set(newState, subPath, value);

      current.props.onChange(newState, component);
    });
  }

  buildPath(path) {
    return this.resolveByPath(path, (err, current, subPath) => {
      if (err) {
        return void 0;
      }

      if (typeof subPath === 'undefined' || subPath === null) {
        return void 0;
      }

      const currentPath = current.props.path;
      return currentPath ? `${currentPath}.${subPath}` : subPath;
    });
  }

  getFormProps() {
    return this.props.form.props;
  }

  _registerChildren(children, topLevel) {
    const { value, map, index, addIndex } = this.props;

    if (topLevel && map && isArray(value)) {
      return value.map((currentValue, index) => {
        return this._registerChildren((
          <Fieldset name={index} key={index} index={index} addIndex={addIndex}>
            {children}
          </Fieldset>
        ));
      });
    }

    const hasIndex = typeof index !== 'undefined';

    return traverse(children, (child) => {
      if (!isFunction(child.type) || !child.type.isElement) {
        return void 0;
      }

      const { name, valueIndex } = child.props;

      const currentValue = this.getValue(name, valueIndex);
      const currentPath = this.buildPath(name);

      return cloneElement(child, {
        originalProps: child.props,
        value: typeof child.props.value !== 'undefined' ? child.props.value : currentValue,
        currentValue,
        form: this.props.form || this,
        parent: this,
        path: currentPath,
        onChange: (value, component) => this.setValue(name, value, component),
      });
    }, (child) => {
      const { replace } = this.getFormProps();
      if (hasIndex && (addIndex || child.props.addIndex)) {
        const updatedChild = extendCallbacks(child, index);
        if (updatedChild !== child) {
          return updatedChild;
        }
      }

      if (!replace) {
        return void 0;
      }

      if (child.type === 'input') {
        return <Input {...child.props} />;
      } else if (child.type === 'select') {
        return <Select {...child.props} />;
      } else if (child.type === 'textarea') {
        return <Textarea {...child.props} />;
      } else if (child.type === 'fieldset' && child.props.name) {
        return <Fieldset {...child.props} />;
      }
    });
  }

  render() {
    const children = this._registerChildren(this.props.children, true);
    const { className } = this.props;

    return (
      <fieldset className={className}>
        {children}
      </fieldset>
    );
  }
}
