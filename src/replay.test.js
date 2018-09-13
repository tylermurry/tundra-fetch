import fetchMock from 'fetch-mock';
import replay, { matchingFunction } from './replay';
import { WILDCARD_MARKER } from './stringSimilarity';

const emptyProfile = require('./fixtures/profiles/no-requests');
const singleRequest = require('./fixtures/profiles/single-request');
const multipleRequests = require('./fixtures/profiles/multiple-requests');

jest.mock('fetch-mock', () => ({
  reset: jest.fn(),
  mock: jest.fn(),
}));

describe('replay', () => {
  describe('matchingFunction', () => {
    let profileRequest;
    let requestURL;
    let requestConfig;

    beforeEach(() => {
      profileRequest = {
        method: 'GET',
        url: 'http://www.someurl.com',
        headers: {
          abc: ['123'],
          xyz: ['456'],
        },
        content: 'body',
      };

      requestURL = 'http://www.someurl.com';
      requestConfig = {
        method: 'GET',
        headers: {
          abc: ['123'],
          xyz: ['456'],
        },
        body: 'body',
      };
    });

    it('should match a standard request on all factors and an empty matching config', () => {
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors and a null matching config', () => {
      expect(matchingFunction(null, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors and a matching config with headers to omit', () => {
      profileRequest.headers.xyz = 'something else';
      expect(matchingFunction({ headersToOmit: ['xyz'] }, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy url', () => {
      profileRequest.url = `http://www.${WILDCARD_MARKER}.com`;
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy header', () => {
      profileRequest.headers.abc = [`1${WILDCARD_MARKER}3`];
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should match a standard request on all factors with a fuzzy body', () => {
      profileRequest.body = `b${WILDCARD_MARKER}y`;
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
    });

    it('should not match a standard request because the URL doesn\'t match', () => {
      profileRequest.url = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the headers don\'t match', () => {
      profileRequest.headers.abc = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the method doesn\'t match', () => {
      profileRequest.method = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });

    it('should not match a standard request because the body doesn\'t match', () => {
      profileRequest.content = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
    });
  });

  describe('default', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should mock requests for an empty profile', () => {
      replay(emptyProfile, {});

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toEqual([]);
    });

    it('should mock requests for an profile with a single request', () => {
      replay(singleRequest, {});

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and the default repeat mode', () => {
      replay(multipleRequests, {});

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and a repeat mode of \'first\'', () => {
      replay(multipleRequests, { repeatMode: 'first' });

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for an profile with two requests and a repeat mode of \'last\'', () => {
      replay(multipleRequests, { repeatMode: 'last' });

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });
  });
});
