'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchingFunction = exports.buildResponseOptions = undefined;

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

var _requestBuilder = require('./requestBuilder');

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var buildResponseOptions = exports.buildResponseOptions = function buildResponseOptions(response) {
  return {
    body: response.content,
    headers: response.headers,
    status: response.statusCode
  };
};

var matchingFunction = exports.matchingFunction = function matchingFunction(matchingConfig, request, response) {
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

    var everythingMatches = urlMatches && methodMatches && bodyMatches && headersMatch;

    if (everythingMatches && matchingConfig.debuggingEnabled) {
      var responseOptions = buildResponseOptions(response);
      var builtRequest = (0, _requestBuilder2.default)(url, config, responseOptions, responseOptions.body);

      (0, _submitRequest2.default)(builtRequest, matchingConfig.debugPort, everythingMatches);
    }

    return everythingMatches;
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

    var responseOptions = buildResponseOptions(response);

    _fetchMock2.default.mock(matchingFunction(config, request, response), buildResponseOptions(response), (0, _fetchMockConfigBuilder2.default)(request, config, repeatMap)).catch(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _extractFetchArgument2, url, fetchConfig, builtRequest;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _extractFetchArgument2 = (0, _fetchArgumentExtractor2.default)(args), url = _extractFetchArgument2.url, fetchConfig = _extractFetchArgument2.config;
              builtRequest = (0, _requestBuilder2.default)(url, fetchConfig, responseOptions, responseOptions.body);

              if (!config.debuggingEnabled) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return (0, _submitRequest2.default)(builtRequest, config.debugPort, false);

            case 5:
              throw Error('Unable to match request');

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });
};
//# sourceMappingURL=replay.js.map