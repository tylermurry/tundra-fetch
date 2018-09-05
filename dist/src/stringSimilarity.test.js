'use strict';

var _stringSimilarity = require('./stringSimilarity');

var _stringSimilarity2 = _interopRequireDefault(_stringSimilarity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('stringSimilarity', function () {
  var WILDCARD = '{{*}}';

  it('should match a target with a valid pattern', function () {
    expect((0, _stringSimilarity2.default)('before' + WILDCARD + 'after', 'beforesomethingafter')).toBe(true);
  });

  it('should match a target with a valid pattern at the beginning', function () {
    expect((0, _stringSimilarity2.default)(WILDCARD + 'after', 'somethingafter')).toBe(true);
  });

  it('should match a target with a valid pattern at the end', function () {
    expect((0, _stringSimilarity2.default)('before' + WILDCARD, 'beforesomething')).toBe(true);
  });

  it('should match a target without populated pattern', function () {
    expect((0, _stringSimilarity2.default)('before' + WILDCARD + 'after', 'beforeafter')).toBe(true);
  });

  it('should match a target against a source without a wildcard', function () {
    expect((0, _stringSimilarity2.default)('string1', 'string1')).toBe(true);
  });

  it('should not match a target against a source without a wildcard', function () {
    expect((0, _stringSimilarity2.default)('string1', 'string2')).toBe(false);
  });

  it('should not match a target with an empty source', function () {
    expect((0, _stringSimilarity2.default)('', 'something')).toBe(false);
  });

  it('should match an empty target against a nwildcarded source', function () {
    expect((0, _stringSimilarity2.default)('' + WILDCARD, '')).toBe(true);
  });

  it('should match an null target against a nwildcarded source', function () {
    expect((0, _stringSimilarity2.default)('' + WILDCARD, null)).toBe(true);
  });

  it('should match if the source and target are both null', function () {
    expect((0, _stringSimilarity2.default)(null, null)).toBe(true);
  });

  it('should not match if the source and target are undefined and null', function () {
    expect((0, _stringSimilarity2.default)(null, undefined)).toBe(false);
  });
});
//# sourceMappingURL=stringSimilarity.test.js.map