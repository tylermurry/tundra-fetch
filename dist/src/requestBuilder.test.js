'use strict';

var _requestBuilder = require('./requestBuilder');

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('requestBuilder', function () {
  var requestConfig = void 0;
  var response = void 0;
  var url = 'url';
  var responseBody = 'response body';

  beforeEach(function () {
    requestConfig = {
      headers: 'request headers',
      method: 'request method',
      body: 'request content'
    };

    response = {
      headers: { 1: ['1'], 2: ['2'] },
      status: 'response status'
    };
  });

  it('should build a standard request', function () {
    expect((0, _requestBuilder2.default)(url, requestConfig, response, responseBody)).toMatchSnapshot();
  });

  it('should build a request without a request config', function () {
    expect((0, _requestBuilder2.default)(url, null, response, responseBody)).toMatchSnapshot();
  });

  it('should build a request without a response', function () {
    expect((0, _requestBuilder2.default)(url, requestConfig, null, responseBody)).toMatchSnapshot();
  });
});
//# sourceMappingURL=requestBuilder.test.js.map