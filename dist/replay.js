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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WILDCARD_MARKER_ESCAPED = '{{\\*}}';

var stringIsSimilarTo = function stringIsSimilarTo(source, target) {
  if (source && target) {
    var wildcardedSource = source.replace(new RegExp((0, _lodash2.default)('*'), 'g'), '\\*').replace(new RegExp((0, _lodash2.default)(WILDCARD_MARKER_ESCAPED), 'g'), '*');

    return _matcher2.default.isMatch(target, wildcardedSource);
  }

  return source === target;
};

exports.default = function (profileRequests, headersToOmit) {
  _fetchMock2.default.reset();

  profileRequests.forEach(function (_ref) {
    var request = _ref.request,
        response = _ref.response;


    var matchingFunction = function matchingFunction(url, opts) {
      var actualOpts = opts || url;
      var actualUrl = opts ? url : url.url;
      var actualOptsHeaders = JSON.stringify((0, _lodash4.default)(actualOpts.headers, headersToOmit));
      var actualRequestHeaders = JSON.stringify((0, _lodash4.default)(request.headers, headersToOmit));

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

    var fetchMockConfig = {
      name: request.method + ' ' + request.url,
      overwriteRoutes: false
    };

    _fetchMock2.default.mock(matchingFunction, responseOptions, fetchMockConfig);
  });
};
//# sourceMappingURL=replay.js.map