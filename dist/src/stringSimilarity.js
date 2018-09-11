'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WILDCARD_MARKER_ESCAPED = undefined;

var _lodash = require('lodash.escaperegexp');

var _lodash2 = _interopRequireDefault(_lodash);

var _matcher = require('matcher');

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WILDCARD_MARKER_ESCAPED = exports.WILDCARD_MARKER_ESCAPED = '{{\\*}}';

exports.default = function (source, target) {
  if (!source || (source || '') === (target || '')) {
    return source === target;
  }

  var wildcardedSource = source.replace(new RegExp((0, _lodash2.default)('*'), 'g'), '\\*').replace(new RegExp((0, _lodash2.default)(WILDCARD_MARKER_ESCAPED), 'g'), '*');

  return _matcher2.default.isMatch(target, wildcardedSource);
};
//# sourceMappingURL=stringSimilarity.js.map