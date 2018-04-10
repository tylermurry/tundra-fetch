'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var submitRequestData = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_fetch, requestURL, requestConfig, response, responseBody, port) {
        var capturedRequest, request;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        capturedRequest = {
                            request: {
                                url: requestURL,
                                headers: requestConfig ? requestConfig.headers : undefined,
                                method: requestConfig ? requestConfig.method : 'GET',
                                content: requestConfig ? requestConfig.body : undefined
                            },
                            response: {
                                headers: response.headers.map,
                                statusCode: response.status,
                                content: responseBody
                            }
                        };

                        // Using XMLHttpRequest to not interfere with the overwritten fetch object.
                        // Sending in a fire-and-forget fashion.

                        request = new XMLHttpRequest();


                        request.open('POST', 'http://localhost:' + port + '/requests');
                        request.setRequestHeader('Content-Type', 'application/json');
                        request.send(JSON.stringify(capturedRequest));

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function submitRequestData(_x2, _x3, _x4, _x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
    };
}();

exports.interceptFetchCalls = interceptFetchCalls;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function interceptFetchCalls(port) {
    var _fetch = global.fetch;
    global.fetch = function (url, config) {
        return _fetch.apply(this, arguments).then(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
                var responseBody;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return data.clone().json();

                            case 3:
                                responseBody = _context.sent;
                                _context.next = 6;
                                return submitRequestData(_fetch, url, config, data, responseBody, port);

                            case 6:
                                _context.next = 12;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](0);

                                console.log('Error wiretapping fetch request');
                                console.log(_context.t0);

                            case 12:
                                return _context.abrupt('return', data);

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 8]]);
            }));

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        }());
    };
}
//# sourceMappingURL=tundra-interceptor.js.map