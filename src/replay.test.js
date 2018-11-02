import fetchMock from 'fetch-mock';
import replay, { matchingFunction } from './replay';
import { WILDCARD_MARKER } from './stringSimilarity';
import submitRequestData from './submitRequest';

const emptyProfile = require('./fixtures/profiles/no-requests');
const singleRequest = require('./fixtures/profiles/single-request');
const multipleRequests = require('./fixtures/profiles/multiple-requests');

jest.mock('fetch-mock', () => ({
  reset: jest.fn(),
  mock: jest.fn(),
}));

jest.mock('./submitRequest', () => jest.fn());

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
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a null matching config', () => {
      expect(matchingFunction(null, profileRequest)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with headers to omit', () => {
      profileRequest.headers.xyz = 'something else';
      expect(matchingFunction({ headersToOmit: ['xyz'] }, profileRequest)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with debugging enabled', () => {
      const response = {
        content: 'body',
        headers: { 1: ['1'], 2: ['2'] },
        statusCode: 200,
      };
      const config = { debuggingEnabled: true, debugPort: 9091 };

      expect(matchingFunction(config, profileRequest, response)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy url', () => {
      profileRequest.url = `http://www.${WILDCARD_MARKER}.com`;
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy header', () => {
      profileRequest.headers.abc = [`1${WILDCARD_MARKER}3`];
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy body', () => {
      profileRequest.body = `b${WILDCARD_MARKER}y`;
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the URL doesn\'t match', () => {
      profileRequest.url = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the headers don\'t match', () => {
      profileRequest.headers.abc = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the method doesn\'t match', () => {
      profileRequest.method = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the body doesn\'t match', () => {
      profileRequest.content = 'bad';
      expect(matchingFunction({}, profileRequest)(requestURL, requestConfig)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });
  });

  describe('default', () => {
    const getConfig = (profileName, dummyProfile) => ({ profileData: { [profileName]: () => dummyProfile } });
    const profileName = 'demo';

    beforeEach(() => {
      jest.resetAllMocks();
      fetchMock.mock.mockImplementation(() => ({ catch: jest.fn() }));
    });

    it('should mock requests for an empty profile', () => {
      const config = getConfig(profileName, emptyProfile);
      replay(profileName, config);

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toEqual([]);
    });

    it('should mock requests for a profile with a single request', () => {
      const config = getConfig(profileName, singleRequest);
      replay(profileName, config);

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and the default repeat mode', () => {
      const config = getConfig(profileName, multipleRequests);
      replay(profileName, config);

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'first\'', () => {
      const config = getConfig(profileName, multipleRequests);
      replay(profileName, { ...config, repeatMode: 'first' });

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'last\'', () => {
      const config = getConfig(profileName, multipleRequests);
      replay(profileName, { ...config, repeatMode: 'last' });

      expect(fetchMock.reset).toBeCalled();
      expect(fetchMock.mock.mock.calls).toMatchSnapshot();
    });

    it('should catch unmatched requests without debugging enabled', () => {
      fetchMock.mock.mockImplementation(() => new Promise((response, reject) => reject(singleRequest[0].request)));

      const config = getConfig(profileName, singleRequest);
      replay(profileName, config);

      expect(fetchMock.reset).toBeCalled();
      expect(submitRequestData).not.toHaveBeenCalled();
    });

    it('should catch unmatched requests with debugging enabled', async () => {
      fetchMock.mock.mockImplementation(() => new Promise((response, reject) => reject(singleRequest[0].request)));

      const config = getConfig(profileName, singleRequest);
      replay(profileName, { ...config, debuggingEnabled: true, debugPort: 9091 });

      expect(fetchMock.reset).toBeCalled();
      expect(await submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should throw exception if no profile is found', () => {
      const newProfileName = 'demo-demo';
      const replayProfile = () => replay(newProfileName,
        { profileData: { [newProfileName]: () => { throw new Error(); } } });

      expect(replayProfile).toThrow();
    });
  });
});
