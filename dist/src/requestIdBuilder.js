"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (request) {
  return hashCode().value(request.method + " " + JSON.stringify(request.headers) + " " + request.url);
};
//# sourceMappingURL=requestIdBuilder.js.map