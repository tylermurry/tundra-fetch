'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchingFunction = undefined;

require('url');

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

var _stringSimilarity = require('./stringSimilarity');

var _stringSimilarity2 = _interopRequireDefault(_stringSimilarity);

var _fetchMockConfigBuilder = require('./fetchMockConfigBuilder');

var _fetchMockConfigBuilder2 = _interopRequireDefault(_fetchMockConfigBuilder);

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

var _removeURLPrefix = require('./removeURLPrefix');

var _removeURLPrefix2 = _interopRequireDefault(_removeURLPrefix);

var _fetchArgumentExtractor = require('./fetchArgumentExtractor');

var _fetchArgumentExtractor2 = _interopRequireDefault(_fetchArgumentExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matchingFunction = exports.matchingFunction = function matchingFunction(matchingConfig, request) {
  return function (_url, _config) {
    var _extractFetchArgument = (0, _fetchArgumentExtractor2.default)([_url, _config]),
        url = _extractFetchArgument.url,
        config = _extractFetchArgument.config;

    var headersToOmit = matchingConfig ? matchingConfig.headersToOmit : null;
    var configHeaders = JSON.stringify((0, _lodash2.default)(config.headers, headersToOmit));
    var requestHeaders = JSON.stringify((0, _lodash2.default)(request.headers, headersToOmit));

    var urlMatches = (0, _stringSimilarity2.default)((0, _removeURLPrefix2.default)(request.url), (0, _removeURLPrefix2.default)(url));
    var bodyMatches = config ? (0, _stringSimilarity2.default)(request.content, config.body) : true;
    var headersMatch = config ? (0, _stringSimilarity2.default)(requestHeaders, configHeaders) : true;
    var methodMatches = config ? config.method === request.method : true;

    return urlMatches && methodMatches && bodyMatches && headersMatch;
  };
};

exports.default = function (profileRequests, config) {
  _fetchMock2.default.reset();

  var repeatMap = (0, _requestRepeatMapBuilder2.default)(profileRequests);

  profileRequests.forEach(function (_ref) {
    var request = _ref.request,
        response = _ref.response;

    var requestRepeatMap = repeatMap[(0, _requestIdBuilder2.default)(request)];
    requestRepeatMap.invocations += 1;

    var responseOptions = {
      body: response.content,
      headers: response.headers,
      status: response.statusCode
    };

    _fetchMock2.default.mock(matchingFunction(config, request), responseOptions, (0, _fetchMockConfigBuilder2.default)(request, config, repeatMap));
  });
};
//# sourceMappingURL=replay.js.map