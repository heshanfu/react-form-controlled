'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var DIFF_TIMEOUT = 100;

function fixUncontrolledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }

  return value;
}

var Input = (function (_Element) {
  _inherits(Input, _Element);

  _createClass(Input, null, [{
    key: 'isElement',
    value: true,
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      name: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]).isRequired
    },
    enumerable: true
  }]);

  function Input(props, context) {
    _classCallCheck(this, Input);

    _get(Object.getPrototypeOf(Input.prototype), 'constructor', this).call(this, props, context);

    this.state = {
      value: fixUncontrolledValue(props.value) };
  }

  _createClass(Input, [{
    key: '_clearChangeTimeout',
    // fix because null and undefined is uncontrolled
    value: function _clearChangeTimeout() {
      if (!this.timeoutId) {
        return;
      }

      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(evn) {
      var target = evn.target || {};
      var value = target.type === 'checkbox' ? !!target.checked : target.value;

      this._clearChangeTimeout();

      this.setState({
        value: value
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      var _this = this;

      var isDiff = this.state.value !== newProps.value;
      if (!isDiff) {
        return;
      }

      // wait for it
      this.timeoutId = setTimeout(function () {
        _this.timeoutId = null;

        if (_this.state.value === _this.props.value) {
          return;
        }

        _this.setState({
          value: fixUncontrolledValue(_this.props.value)
        });
      }, DIFF_TIMEOUT);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._clearChangeTimeout();
    }
  }, {
    key: 'render',
    value: function render() {
      var checked = this.props.type === 'checkbox' && this.props.value || this.props.type === 'radio' && this.props.value === this.props.currentValue;

      return _react2['default'].createElement('input', {
        autoComplete: this.props.autoComplete,
        onChange: this.handleChange.bind(this),
        type: this.props.type,
        disabled: this.props.disabled,
        checked: checked ? checked : void 0,
        className: this.props.className,
        name: this.props.name,
        id: this.props.id,
        size: this.props.size,
        min: this.props.min,
        max: this.props.max,
        required: this.props.required,
        placeholder: this.props.placeholder,
        value: this.state.value });
    }
  }]);

  return Input;
})(_Element3['default']);

exports['default'] = Input;
module.exports = exports['default'];