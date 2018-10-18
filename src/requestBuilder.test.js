import buildRequest from './requestBuilder';

describe('requestBuilder', () => {
  let requestConfig;
  let response;
  const url = 'url';
  const responseBody = 'response body';

  beforeEach(() => {
    requestConfig = {
      headers: 'request headers',
      method: 'request method',
      body: 'request content',
    };

    response = {
      headers: { 1: ['1'], 2: ['2'] },
      status: 'response status',
    };
  });

  it('should build a standard request', () => {
    expect(buildRequest(url, requestConfig, response, responseBody)).toMatchSnapshot();
  });

  it('should build a request without a request config', () => {
    expect(buildRequest(url, null, response, responseBody)).toMatchSnapshot();
  });

  it('should build a request without a response', () => {
    expect(buildRequest(url, requestConfig, null, responseBody)).toMatchSnapshot();
  });
});
