'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, config, repeatMap) {
  var baseConfig = {
    name: (0, _requestIdBuilder2.default)(request),
    overwriteRoutes: false
  };

  var repeatMode = config.repeatMode && config.repeatMode.toUpperCase();

  if (repeatMode === 'FIRST') {
    return baseConfig;
  }

  var _repeatMap$buildReque = repeatMap[(0, _requestIdBuilder2.default)(request)],
      invocations = _repeatMap$buildReque.invocations,
      repeated = _repeatMap$buildReque.repeated;


  if (invocations >= repeated) {
    if (repeatMode === 'LAST') {
      return baseConfig;
    }
  }

  baseConfig.repeat = 1;

  return baseConfig;
};
//# sourceMappingURL=fetchMockConfigBuilder.js.map