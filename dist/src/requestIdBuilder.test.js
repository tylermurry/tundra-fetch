'use strict';

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('requestIdBuilder', function () {
  it('should build a request id', function () {
    expect((0, _requestIdBuilder2.default)({
      method: 'GET',
      url: 'http://some.url'
    })).toBe(215916126);
  });
});
//# sourceMappingURL=requestIdBuilder.test.js.map