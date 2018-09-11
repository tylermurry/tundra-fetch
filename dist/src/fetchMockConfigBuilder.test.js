'use strict';

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

var _fetchMockConfigBuilder = require('./fetchMockConfigBuilder');

var _fetchMockConfigBuilder2 = _interopRequireDefault(_fetchMockConfigBuilder);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildRequest = function buildRequest(method, url) {
  return { request: { method: method, url: url } };
};

describe('fetchMockConfigBuilder', function () {
  var requests = [buildRequest('GET', 'http://some.url'), buildRequest('GET', 'http://some.url')];

  it('should build a config when no input config is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    // repeatMap[buildRequestId(request)].invocations=

    expect((0, _fetchMockConfigBuilder2.default)(request, null, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
      repeat: 1
    });
  });

  it('should build a config when a repeatMode of \'first\' is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'first' };

    expect((0, _fetchMockConfigBuilder2.default)(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false
    });
  });

  it('should build a config when a repeatMode of \'last\' is given and invocations do not exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'last' };

    expect((0, _fetchMockConfigBuilder2.default)(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
      repeat: 1
    });
  });

  it('should build a config when a repeatMode of \'last\' is given and invocations exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'last' };

    repeatMap[(0, _requestIdBuilder2.default)(request)].invocations = 3;

    expect((0, _fetchMockConfigBuilder2.default)(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false
    });
  });
});
//# sourceMappingURL=fetchMockConfigBuilder.test.js.map