import buildRequestId from './requestIdBuilder';
import requestRepeatMapBuilder from './requestRepeatMapBuilder';

describe('requestRepeatMapBuilder', () => {
  const buildRequest = (method, url) => ({ request: { method, url } });

  it('should produce the correct map for a single requests', () => {
    const requests = [
      buildRequest('GET', 'http://url1.com'),
    ];

    expect(requestRepeatMapBuilder(requests)).toEqual({
      [buildRequestId(requests[0].request)]: {
        repeated: 1,
        invocations: 0,
      },
    });
  });

  it('should produce the correct map for a repeating request', () => {
    const requests = [
      buildRequest('GET', 'http://url1.com'),
      buildRequest('GET', 'http://url1.com'),
    ];

    expect(requestRepeatMapBuilder(requests)).toEqual({
      [buildRequestId(requests[0].request)]: {
        repeated: 2,
        invocations: 0,
      },
    });
  });

  it('should produce the correct map for a single request and a repeated request', () => {
    const requests = [
      buildRequest('GET', 'http://url1.com'),
      buildRequest('GET', 'http://url1.com'),
      buildRequest('GET', 'http://url2.com'),
    ];

    expect(requestRepeatMapBuilder(requests)).toEqual({
      [buildRequestId(requests[0].request)]: {
        repeated: 2,
        invocations: 0,
      },
      [buildRequestId(requests[2].request)]: {
        repeated: 1,
        invocations: 0,
      },
    });
  });

  it('should produce the correct map for two repeated requests', () => {
    const requests = [
      buildRequest('GET', 'http://url1.com'),
      buildRequest('GET', 'http://url1.com'),
      buildRequest('GET', 'http://url2.com'),
      buildRequest('GET', 'http://url2.com'),
    ];

    expect(requestRepeatMapBuilder(requests)).toEqual({
      [buildRequestId(requests[0].request)]: {
        repeated: 2,
        invocations: 0,
      },
      [buildRequestId(requests[2].request)]: {
        repeated: 2,
        invocations: 0,
      },
    });
  });

  it('should produce the correct map for no requests', () => {
    expect(requestRepeatMapBuilder([])).toEqual({});
  });

  it('should produce the correct map for a null request object', () => {
    expect(requestRepeatMapBuilder(null)).toEqual({});
  });
});
