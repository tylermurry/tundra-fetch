'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interceptFetchCalls = exports.replayProfile = undefined;

var _replay = require('./replay');

var _replay2 = _interopRequireDefault(_replay);

var _intercept = require('./intercept');

var _intercept2 = _interopRequireDefault(_intercept);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var replayProfile = exports.replayProfile = _replay2.default;
var interceptFetchCalls = exports.interceptFetchCalls = _intercept2.default;
//# sourceMappingURL=index.js.map