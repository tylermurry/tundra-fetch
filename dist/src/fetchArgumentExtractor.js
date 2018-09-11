'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (fetchParams) {
  if (fetchParams && fetchParams.length === 1) {
    // Scenario: fetch('url')
    if (isString(fetchParams[0])) {
      return {
        url: fetchParams[0],
        config: {
          method: 'GET'
        }
      };
    }
    // Scenario: fetch({ url: 'url', method: 'GET' })
    if (isObject(fetchParams[0])) {
      return {
        url: fetchParams[0].url,
        config: fetchParams[0]
      };
    }
  }

  if (fetchParams && fetchParams.length === 2) {
    // Scenario: fetch('url', { method: 'GET' })
    if (isString(fetchParams[0]) && isObject(fetchParams[1])) {
      return {
        url: fetchParams[0],
        config: fetchParams[1]
      };
    }
  }

  throw Error('Unknown fetch argument configuration: ' + fetchParams);
};

var isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

var isObject = function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || value instanceof Object;
};
//# sourceMappingURL=fetchArgumentExtractor.js.map