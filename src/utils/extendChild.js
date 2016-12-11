import { cloneElement } from 'react';

export default function extendChild(child, parent) {
  if (!parent.isIndex() || !child.props) {
    return child;
  }

  const { provideIndex, providePath, provideIndexes, remove, up, down, onClick } = child.props;
  const newProps = {};
  let changed = false;

  if (provideIndex || providePath || provideIndexes) {
    newProps.provideIndex = undefined;
    newProps.providePath = undefined;
    newProps.provideIndexes = undefined;

    changed = true;

    if (provideIndex) {
      const key = typeof provideIndex === 'string' ? provideIndex : 'onClick';
      const fn = newProps[key] || child.props[key];
      newProps[key] = (...args) => fn(parent.props.index, ...args);
    }

    if (providePath) {
      const key = typeof providePath === 'string' ? providePath : 'onClick';
      const fn = newProps[key] || child.props[key];
      newProps[key] = (...args) => fn(parent.getPath(), ...args);
    }

    if (provideIndexes) {
      const key = typeof provideIndexes === 'string' ? provideIndexes : 'onClick';
      const fn = newProps[key] || child.props[key];
      newProps[key] = (...args) => fn(parent.getIndexes(), ...args);
    }
  }

  const onClickBefore = newProps.onClick || onClick;

  if (remove) {
    newProps.remove = undefined;
    changed = true;

    newProps.onClick = () => {
      parent.remove();

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  } else if (up) {
    newProps.up = undefined;
    changed = true;

    newProps.onClick = () => {
      parent.up();

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  } else if (down) {
    newProps.down = undefined;
    changed = true;

    newProps.onClick = () => {
      parent.down();

      if (onClickBefore) {
        setTimeout(onClickBefore, 0);
      }
    };
  }

  if (changed) {
    return cloneElement(child, newProps);
  }

  return child;
}
