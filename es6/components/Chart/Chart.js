var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React, { Component } from 'react';
import { compose } from 'recompose';

import StyledChart from './StyledChart';

import { parseMetricToInt } from '../utils/mixins';
import { colorForName } from '../utils/colors';

import { withTheme } from '../hocs';

import doc from './doc';

var renderBars = function renderBars(values, bounds, scale, height) {
  return (values || []).map(function (valueArg, index) {
    var label = valueArg.label,
        value = valueArg.value,
        rest = _objectWithoutProperties(valueArg, ['label', 'value']);

    var key = 'p-' + index;
    var d = 'M ' + value[0] * scale[0] + ',' + (height - bounds[1][0] * scale[1]) + '\n      L ' + value[0] * scale[0] + ',' + (height - value[1] * scale[1]);

    return React.createElement(
      'g',
      { key: key, fill: 'none' },
      React.createElement(
        'title',
        null,
        label
      ),
      React.createElement('path', _extends({ d: d }, rest))
    );
  });
};

var renderLine = function renderLine(values, bounds, scale, height) {
  var d = '';
  (values || []).forEach(function (_ref, index) {
    var value = _ref.value;

    d += (index ? ' L' : 'M') + '\n      ' + value[0] * scale[0] + ',' + (height - value[1] * scale[1]);
  });
  return React.createElement(
    'g',
    { fill: 'none' },
    React.createElement('path', { d: d })
  );
};

var renderArea = function renderArea(values, bounds, scale, height, props) {
  var color = props.color,
      theme = props.theme;

  var d = 'M 0,' + height;
  (values || []).forEach(function (_ref2, index) {
    var value = _ref2.value;

    if (!index) {
      d += 'M ' + value[0] * scale[0] + ',' + height;
    }
    d += ' L ' + value[0] * scale[0] + ',' + (height - value[1] * scale[1]);
  });
  d += 'L ' + values[values.length - 1].value[0] * scale[0] + ',' + height + ' Z';
  return React.createElement(
    'g',
    { fill: colorForName(color, theme) },
    React.createElement('path', { d: d })
  );
};

var Chart = function (_Component) {
  _inherits(Chart, _Component);

  function Chart() {
    _classCallCheck(this, Chart);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Chart.prototype.render = function render() {
    var _props = this.props,
        initialBounds = _props.bounds,
        color = _props.color,
        round = _props.round,
        size = _props.size,
        theme = _props.theme,
        thickness = _props.thickness,
        title = _props.title,
        type = _props.type,
        values = _props.values,
        rest = _objectWithoutProperties(_props, ['bounds', 'color', 'round', 'size', 'theme', 'thickness', 'title', 'type', 'values']);

    var bounds = initialBounds;
    if (!bounds) {
      // derive from values, TODO: move outside of render()
      bounds = [[], []];
      (values || []).forEach(function (value) {
        bounds[0][0] = Math.min(bounds[0][0], value[0]);
        bounds[0][1] = Math.max(bounds[0][1], value[0]);
        bounds[1][0] = Math.min(bounds[1][0], value[1]);
        bounds[1][1] = Math.max(bounds[1][1], value[1]);
      });
    }

    var sizeWidth = typeof size === 'string' ? size : size.width;
    var sizeHeight = typeof size === 'string' ? size : size.height;
    var width = sizeWidth === 'full' ? bounds[0][1] - bounds[0][0] : parseMetricToInt(theme.global.size[sizeWidth]);
    var height = sizeHeight === 'full' ? bounds[1][1] - bounds[1][0] : parseMetricToInt(theme.global.size[sizeHeight]);
    var strokeWidth = parseMetricToInt(theme.global.edgeSize[thickness]);
    var scale = [width / (bounds[0][1] - bounds[0][0]), height / (bounds[1][1] - bounds[1][0])];

    var contents = void 0;
    if (type === 'bar') {
      contents = renderBars(values, bounds, scale, height);
    } else if (type === 'line') {
      contents = renderLine(values, bounds, scale, height);
    } else if (type === 'area') {
      contents = renderArea(values, bounds, scale, height, this.props);
    }

    return React.createElement(
      StyledChart,
      _extends({
        viewBox: '-' + strokeWidth / 2 + ' -' + strokeWidth / 2 + '\n          ' + (width + strokeWidth) + ' ' + (height + strokeWidth),
        preserveAspectRatio: 'none',
        width: size === 'full' ? '100%' : width,
        height: height
      }, rest),
      React.createElement(
        'title',
        null,
        title
      ),
      React.createElement(
        'g',
        {
          stroke: colorForName(color, theme),
          strokeWidth: strokeWidth,
          strokeLinecap: round ? 'round' : 'square',
          strokeLinejoin: round ? 'round' : 'miter'
        },
        contents
      )
    );
  };

  return Chart;
}(Component);

Chart.defaultProps = {
  color: 'accent-1',
  size: { width: 'medium', height: 'small' },
  thickness: 'medium',
  type: 'bar'
};


if (process.env.NODE_ENV !== 'production') {
  doc(Chart);
}

export default compose(withTheme)(Chart);