'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hashcode = require('hashcode');

exports.default = function (request) {
  return (0, _hashcode.hashCode)().value(request.method + ' ' + JSON.stringify(request.headers) + ' ' + request.url);
};
//# sourceMappingURL=requestIdBuilder.js.map