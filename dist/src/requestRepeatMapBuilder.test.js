'use strict';

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('requestRepeatMapBuilder', function () {
  var buildRequest = function buildRequest(method, url) {
    return { request: { method: method, url: url } };
  };

  it('should produce the correct map for a single requests', function () {
    var requests = [buildRequest('GET', 'http://url1.com')];

    expect((0, _requestRepeatMapBuilder2.default)(requests)).toEqual(_defineProperty({}, (0, _requestIdBuilder2.default)(requests[0].request), {
      repeated: 1,
      invocations: 0
    }));
  });

  it('should produce the correct map for a repeating request', function () {
    var requests = [buildRequest('GET', 'http://url1.com'), buildRequest('GET', 'http://url1.com')];

    expect((0, _requestRepeatMapBuilder2.default)(requests)).toEqual(_defineProperty({}, (0, _requestIdBuilder2.default)(requests[0].request), {
      repeated: 2,
      invocations: 0
    }));
  });

  it('should produce the correct map for a single request and a repeated request', function () {
    var _expect$toEqual3;

    var requests = [buildRequest('GET', 'http://url1.com'), buildRequest('GET', 'http://url1.com'), buildRequest('GET', 'http://url2.com')];

    expect((0, _requestRepeatMapBuilder2.default)(requests)).toEqual((_expect$toEqual3 = {}, _defineProperty(_expect$toEqual3, (0, _requestIdBuilder2.default)(requests[0].request), {
      repeated: 2,
      invocations: 0
    }), _defineProperty(_expect$toEqual3, (0, _requestIdBuilder2.default)(requests[2].request), {
      repeated: 1,
      invocations: 0
    }), _expect$toEqual3));
  });

  it('should produce the correct map for two repeated requests', function () {
    var _expect$toEqual4;

    var requests = [buildRequest('GET', 'http://url1.com'), buildRequest('GET', 'http://url1.com'), buildRequest('GET', 'http://url2.com'), buildRequest('GET', 'http://url2.com')];

    expect((0, _requestRepeatMapBuilder2.default)(requests)).toEqual((_expect$toEqual4 = {}, _defineProperty(_expect$toEqual4, (0, _requestIdBuilder2.default)(requests[0].request), {
      repeated: 2,
      invocations: 0
    }), _defineProperty(_expect$toEqual4, (0, _requestIdBuilder2.default)(requests[2].request), {
      repeated: 2,
      invocations: 0
    }), _expect$toEqual4));
  });

  it('should produce the correct map for no requests', function () {
    expect((0, _requestRepeatMapBuilder2.default)([])).toEqual({});
  });

  it('should produce the correct map for a null request object', function () {
    expect((0, _requestRepeatMapBuilder2.default)(null)).toEqual({});
  });
});
//# sourceMappingURL=requestRepeatMapBuilder.test.js.map