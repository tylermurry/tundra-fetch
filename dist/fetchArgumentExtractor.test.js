'use strict';

var _fetchArgumentExtractor = require('./fetchArgumentExtractor');

var _fetchArgumentExtractor2 = _interopRequireDefault(_fetchArgumentExtractor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('fetchArgumentUtil', function () {
  it('should extract default fetch arguments', function () {
    expect((0, _fetchArgumentExtractor2.default)(['someurl'])).toEqual({
      url: 'someurl',
      config: {
        method: 'GET'
      }
    });
  });

  it('should extract fetch arguments with just a request config', function () {
    expect((0, _fetchArgumentExtractor2.default)([{ url: 'someurl', method: 'POST' }])).toEqual({
      url: 'someurl',
      config: {
        url: 'someurl',
        method: 'POST'
      }
    });
  });

  it('should extract fetch arguments with a URL and a request config', function () {
    expect((0, _fetchArgumentExtractor2.default)(['someurl', { method: 'PUT' }])).toEqual({
      url: 'someurl',
      config: {
        method: 'PUT'
      }
    });
  });

  it('should interpret the arguments as unknown', function () {
    expect(function () {
      return (0, _fetchArgumentExtractor2.default)();
    }).toThrow('Unknown fetch argument configuration: ');
  });
});
//# sourceMappingURL=fetchArgumentExtractor.test.js.map