'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('url');

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _lodash = require('lodash.escaperegexp');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omit');

var _lodash4 = _interopRequireDefault(_lodash3);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

var _stringSimilarity = require('./stringSimilarity');

var _stringSimilarity2 = _interopRequireDefault(_stringSimilarity);

var _fetchMockConfigBuilder = require('./fetchMockConfigBuilder');

var _fetchMockConfigBuilder2 = _interopRequireDefault(_fetchMockConfigBuilder);

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (profileRequests, config) {
  _fetchMock2.default.reset();

  var repeatMap = (0, _requestRepeatMapBuilder2.default)(profileRequests);

  profileRequests.forEach(function (_ref) {
    var request = _ref.request,
        response = _ref.response;

    var requestRepeatMap = repeatMap[(0, _requestIdBuilder2.default)(request)];
    requestRepeatMap.invocations += 1;

    var matchingFunction = function matchingFunction(url, opts) {
      var actualOpts = opts || url;
      var actualUrl = opts ? url : url.url;
      var actualOptsHeaders = JSON.stringify((0, _lodash4.default)(actualOpts.headers, config.headersToOmit));
      var actualRequestHeaders = JSON.stringify((0, _lodash4.default)(request.headers, config.headersToOmit));

      var urlMatches = new RegExp('^(https?://)?(www\\.)?' + (0, _lodash2.default)(request.url) + '$', 'g').test(actualUrl);
      var bodyMatches = actualOpts ? (0, _stringSimilarity2.default)(request.content, actualOpts.body) : true;
      var headersMatch = actualOpts ? actualOptsHeaders === actualRequestHeaders : true;
      var methodMatches = actualOpts ? actualOpts.method === request.method : true;

      return urlMatches && methodMatches && bodyMatches && headersMatch;
    };

    var responseOptions = {
      body: response.content,
      headers: response.headers,
      status: response.statusCode
    };

    _fetchMock2.default.mock(matchingFunction, responseOptions, (0, _fetchMockConfigBuilder2.default)(request, config, repeatMap));
  });
};
//# sourceMappingURL=replay.js.map