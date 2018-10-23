'use strict';

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _intercept = require('./intercept');

var _intercept2 = _interopRequireDefault(_intercept);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

jest.mock('./submitRequest', function () {
  return jest.fn();
});

describe('intercept', function () {
  var callback = jest.fn();

  beforeEach(function () {
    _fetchMock2.default.restore();
    jest.clearAllMocks();
  });

  it('should intercept a plain url', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock2.default.get('http://someurl.com', { data: 'abc123' });
            (0, _intercept2.default)(12345, callback);

            _context.next = 4;
            return global.fetch('http://someurl.com');

          case 4:
            _context.next = 6;
            return _context.sent.json();

          case 6:
            response = _context.sent;


            expect(response).toEqual({ data: 'abc123' });
            expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
            expect(callback).toHaveBeenCalled();

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should intercept a url with custom options', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var headers, options, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            headers = { some: 'header' };
            options = {
              method: 'GET',
              headers: headers
            };


            _fetchMock2.default.get('http://someurl.com', { data: 'abc123' }, { headers: headers });
            (0, _intercept2.default)(12345, callback);

            _context2.next = 6;
            return global.fetch('http://someurl.com', options);

          case 6:
            _context2.next = 8;
            return _context2.sent.json();

          case 8:
            response = _context2.sent;


            expect(response).toEqual({ data: 'abc123' });
            expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
            expect(callback).toHaveBeenCalled();

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should intercept a POST fetch with a json body', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var body, headers, interceptedCalls, options, response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            body = { some: 'request body' };
            headers = { some: 'header' };
            interceptedCalls = [];


            _fetchMock2.default.post('http://someurl.com', { data: 'abc123' }, { headers: headers, body: body });
            (0, _intercept2.default)(12345, function (request) {
              return interceptedCalls.push(request);
            });

            options = {
              method: 'POST',
              headers: headers,
              body: body
            };
            _context3.next = 8;
            return global.fetch('http://someurl.com', options);

          case 8:
            _context3.next = 10;
            return _context3.sent.json();

          case 10:
            response = _context3.sent;


            expect(response).toEqual({ data: 'abc123' });
            expect(_submitRequest2.default.mock.calls).toMatchSnapshot();

            expect(interceptedCalls.length).toBe(1);
            expect(interceptedCalls[0]).toEqual({
              request: {
                url: 'http://someurl.com',
                headers: { some: 'header' },
                method: 'POST',
                content: { some: 'request body' }
              },
              response: {
                headers: undefined,
                statusCode: 200,
                content: { data: 'abc123' }
              }
            });

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});
//# sourceMappingURL=intercept.test.js.map