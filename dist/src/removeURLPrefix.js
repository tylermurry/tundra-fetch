'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (url) {
  return url ? url.replace(/^(https?:\/\/)?(www\.)?/, '') : null;
};
//# sourceMappingURL=removeURLPrefix.js.map