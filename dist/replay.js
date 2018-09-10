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

var _matcher = require('matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _hashcode = require('hashcode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WILDCARD_MARKER_ESCAPED = '{{\\*}}';

var stringIsSimilarTo = function stringIsSimilarTo(source, target) {
  if (source && target) {
    var wildcardedSource = source.replace(new RegExp((0, _lodash2.default)('*'), 'g'), '\\*').replace(new RegExp((0, _lodash2.default)(WILDCARD_MARKER_ESCAPED), 'g'), '*');

    return _matcher2.default.isMatch(target, wildcardedSource);
  }

  return source === target;
};

var buildRequestId = function buildRequestId(request) {
  return (0, _hashcode.hashCode)().value(request.method + ' ' + JSON.stringify(request.headers) + ' ' + request.url);
};

var buildRequestRepeatMap = function buildRequestRepeatMap(requests) {
  var repeatMap = [];

  requests.forEach(function (_ref) {
    var request = _ref.request;

    var requestId = buildRequestId(request);

    if (requestId in repeatMap) {
      repeatMap[requestId].repeated += 1;
    } else {
      repeatMap[requestId] = {
        repeated: 1,
        invocations: 0
      };
    }
  });

  return repeatMap;
};

var buildFetchMockConfig = function buildFetchMockConfig(request, config, repeatMap) {
  var baseConfig = {
    name: buildRequestId(request),
    overwriteRoutes: false
  };

  var repeatMode = config.repeatMode && config.repeatMode.toUpperCase();

  if (repeatMode === 'FIRST') {
    return baseConfig;
  }

  var _repeatMap$buildReque = repeatMap[buildRequestId(request)],
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

exports.default = function (profileRequests, config) {
  _fetchMock2.default.reset();

  var repeatMap = buildRequestRepeatMap(profileRequests);

  profileRequests.forEach(function (_ref2) {
    var request = _ref2.request,
        response = _ref2.response;

    var requestRepeatMap = repeatMap[buildRequestId(request)];
    requestRepeatMap.invocations += 1;

    var matchingFunction = function matchingFunction(url, opts) {
      var actualOpts = opts || url;
      var actualUrl = opts ? url : url.url;
      var actualOptsHeaders = JSON.stringify((0, _lodash4.default)(actualOpts.headers, config.headersToOmit));
      var actualRequestHeaders = JSON.stringify((0, _lodash4.default)(request.headers, config.headersToOmit));

      var urlMatches = new RegExp('^(https?://)?(www\\.)?' + (0, _lodash2.default)(request.url) + '$', 'g').test(actualUrl);
      var bodyMatches = actualOpts ? stringIsSimilarTo(request.content, actualOpts.body) : true;
      var headersMatch = actualOpts ? actualOptsHeaders === actualRequestHeaders : true;
      var methodMatches = actualOpts ? actualOpts.method === request.method : true;

      return urlMatches && methodMatches && bodyMatches && headersMatch;
    };

    var responseOptions = {
      body: response.content,
      headers: response.headers,
      status: response.statusCode
    };

    _fetchMock2.default.mock(matchingFunction, responseOptions, buildFetchMockConfig(request, config, repeatMap));
  });
};
//# sourceMappingURL=replay.js.map