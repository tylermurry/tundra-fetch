'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchArgumentExtractor = require('./fetchArgumentExtractor');

var _fetchArgumentExtractor2 = _interopRequireDefault(_fetchArgumentExtractor);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

var _requestBuilder = require('./requestBuilder');

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
        var responseBody, builtRequest;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return data.clone().json();

              case 3:
                responseBody = _context.sent;
                builtRequest = (0, _requestBuilder2.default)(url, config, data, responseBody);
                _context.next = 7;
                return (0, _submitRequest2.default)(builtRequest, port);

              case 7:
                if (callback) callback(builtRequest);
                _context.next = 14;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](0);

                console.error('Error wiretapping fetch request');
                console.error(_context.t0);

              case 14:
                return _context.abrupt('return', data);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[0, 10]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  };
};
//# sourceMappingURL=intercept.js.map