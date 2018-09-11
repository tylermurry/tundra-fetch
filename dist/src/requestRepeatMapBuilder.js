'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (requests) {
  var repeatMap = {};

  if (requests) {
    requests.forEach(function (_ref) {
      var request = _ref.request;

      var requestId = (0, _requestIdBuilder2.default)(request);

      if (requestId in repeatMap) {
        repeatMap[requestId].repeated += 1;
      } else {
        repeatMap[requestId] = {
          repeated: 1,
          invocations: 0
        };
      }
    });
  }

  return repeatMap;
};
//# sourceMappingURL=requestRepeatMapBuilder.js.map