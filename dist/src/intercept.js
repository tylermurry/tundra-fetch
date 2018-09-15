'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var submitRequestData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_fetch, requestURL, requestConfig, response, responseBody, port) {
    var capturedRequest, request;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            capturedRequest = buildRequest(requestURL, requestConfig, response, responseBody);

            // Using XMLHttpRequest to not interfere with the overwritten fetch object.
            // Sending in a fire-and-forget fashion.

            request = new XMLHttpRequest(); // eslint-disable-line no-undef

            request.open('POST', 'http://localhost:' + port + '/requests');
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(capturedRequest));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function submitRequestData(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

var _fetchArgumentExtractor = require('./fetchArgumentExtractor');

var _fetchArgumentExtractor2 = _interopRequireDefault(_fetchArgumentExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var buildRequest = function buildRequest(requestURL, requestConfig, response, responseBody) {
  return {
    request: {
      url: requestURL,
      headers: requestConfig.headers,
      method: requestConfig.method,
      content: requestConfig.body
    },
    response: {
      headers: response.headers.map,
      statusCode: response.status,
      content: responseBody
    }
  };
};

exports.default = function (port, callback) {
  var originalfetch = global.fetch;
  global.fetch = function interceptFetch() {
    var _this = this;

    for (var _len = arguments.length, fetchParams = Array(_len), _key = 0; _key < _len; _key++) {
      fetchParams[_key] = arguments[_key];
    }

    var _extractFetchArgument = (0, _fetchArgumentExtractor2.default)(fetchParams),
        url = _extractFetchArgument.url,
        config = _extractFetchArgument.config;

    return originalfetch.apply(this, arguments).then(function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
        var responseBody;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return data.clone().json();

              case 3:
                responseBody = _context2.sent;
                _context2.next = 6;
                return submitRequestData(originalfetch, url, config, data, responseBody, port);

              case 6:
                if (callback) callback(buildRequest(url, config, data, responseBody));
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](0);

                console.error('Error wiretapping fetch request');
                console.error(_context2.t0);

              case 13:
                return _context2.abrupt('return', data);

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this, [[0, 9]]);
      }));

      return function (_x7) {
        return _ref2.apply(this, arguments);
      };
    }());
  };
};
//# sourceMappingURL=intercept.js.map