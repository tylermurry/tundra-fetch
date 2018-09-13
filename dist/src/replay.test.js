'use strict';

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _replay = require('./replay');

var _replay2 = _interopRequireDefault(_replay);

var _stringSimilarity = require('./stringSimilarity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyProfile = require('./fixtures/profiles/no-requests');
var singleRequest = require('./fixtures/profiles/single-request');
var multipleRequests = require('./fixtures/profiles/multiple-requests');

jest.mock('fetch-mock', function () {
  return {
    reset: jest.fn(),
    mock: jest.fn()
  };
});

describe('replay', function () {
  describe('matchingFunction', function () {
    var profileRequest = void 0;
    var requestURL = void 0;
    var requestConfig = void 0;

    beforeEach(function () {
      profileRequest = {
        method: 'GET',
        url: 'http://www.someurl.com',
        headers: {
          abc: ['123'],
          xyz: ['456']
        },
        content: 'body'
      };

      requestURL = 'http://www.someurl.com';
      requestConfig = {
        method: 'GET',
        headers: {
          abc: ['123'],
          xyz: ['456']
        },
        body: 'body'
      };
    });

    it('should match a standard request on all factors and an empty matching config', function () {
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors and a null matching config', function () {
      expect((0, _replay.matchingFunction)(null, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors and a matching config with headers to omit', function () {
      profileRequest.headers.xyz = 'something else';
      expect((0, _replay.matchingFunction)({ headersToOmit: ['xyz'] }, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy url', function () {
      profileRequest.url = 'http://www.' + _stringSimilarity.WILDCARD_MARKER + '.com';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy header', function () {
      profileRequest.headers.abc = ['1' + _stringSimilarity.WILDCARD_MARKER + '3'];
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy body', function () {
      profileRequest.body = 'b' + _stringSimilarity.WILDCARD_MARKER + 'y';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should not match a standard request because the URL doesn\'t match', function () {
      profileRequest.url = 'bad';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the headers don\'t match', function () {
      profileRequest.headers.abc = 'bad';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the method doesn\'t match', function () {
      profileRequest.method = 'bad';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the body doesn\'t match', function () {
      profileRequest.content = 'bad';
      expect((0, _replay.matchingFunction)({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });
  });

  describe('default', function () {
    beforeEach(function () {
      jest.resetAllMocks();
    });

    it('should mock requests for an empty profile', function () {
      (0, _replay2.default)(emptyProfile, {});

      expect(_fetchMock2.default.reset).toBeCalled();
      expect(_fetchMock2.default.mock.mock.calls).toEqual([]);
    });

    it('should mock requests for an profile with a single request', function () {
      (0, _replay2.default)(singleRequest, {});

      expect(_fetchMock2.default.reset).toBeCalled();
      expect(_fetchMock2.default.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and the default repeat mode', function () {
      (0, _replay2.default)(multipleRequests, {});

      expect(_fetchMock2.default.reset).toBeCalled();
      expect(_fetchMock2.default.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and a repeat mode of \'first\'', function () {
      (0, _replay2.default)(multipleRequests, { repeatMode: 'first' });

      expect(_fetchMock2.default.reset).toBeCalled();
      expect(_fetchMock2.default.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and a repeat mode of \'last\'', function () {
      (0, _replay2.default)(multipleRequests, { repeatMode: 'last' });

      expect(_fetchMock2.default.reset).toBeCalled();
      expect(_fetchMock2.default.mock.mock.calls).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=replay.test.js.map