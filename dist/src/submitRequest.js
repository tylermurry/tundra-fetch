'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(capturedRequest, port) {
    var matched = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var request, requestUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Using XMLHttpRequest to not interfere with the overwritten fetch object.
            // Sending in a fire-and-forget fashion.
            request = new XMLHttpRequest(); // eslint-disable-line no-undef

            requestUrl = 'http://localhost:' + port + '/' + (matched ? 'requests' : 'requests/type/unmatched');


            request.open('POST', requestUrl);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(capturedRequest));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=submitRequest.js.map