'use strict';

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('submitRequest', function () {
  beforeEach(function () {
    var xmlHttpRequestMocks = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn()
    };

    global.XMLHttpRequest = function () {
      return xmlHttpRequestMocks;
    };
  });

  it('should send the matched request properly', function () {
    (0, _submitRequest2.default)({ request: 'data' }, 123, true);

    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:123/requests');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });

  it('should send the unmatched request properly', function () {
    (0, _submitRequest2.default)({ request: 'data' }, 123, false);

    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:123/requests/type/unmatched');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });
});
//# sourceMappingURL=submitRequest.test.js.map