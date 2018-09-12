'use strict';

var _removeURLPrefix = require('./removeURLPrefix');

var _removeURLPrefix2 = _interopRequireDefault(_removeURLPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('removeURLPrefix', function () {
  var urlWithoutPrefix = 'someurl.com/something/goes/here?abc=123';

  it('should remove \'http://www.\' from the URL', function () {
    expect((0, _removeURLPrefix2.default)('http://www.' + urlWithoutPrefix)).toBe(urlWithoutPrefix);
  });

  it('should remove \'www.\' from the URL', function () {
    expect((0, _removeURLPrefix2.default)('www.' + urlWithoutPrefix)).toBe(urlWithoutPrefix);
  });

  it('should remove nothing from a URL without a prefix', function () {
    expect((0, _removeURLPrefix2.default)(urlWithoutPrefix)).toBe(urlWithoutPrefix);
  });

  it('should return null for a url that is null', function () {
    expect((0, _removeURLPrefix2.default)(null)).toBe(null);
  });
});
//# sourceMappingURL=removeURLPrefix.test.js.map