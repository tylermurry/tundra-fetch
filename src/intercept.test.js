import fetchMock from 'fetch-mock';
import interceptFetchCalls from './intercept';
import submitRequest from './submitRequest';

jest.mock('./submitRequest', () => jest.fn());

describe('intercept', () => {
  const callback = jest.fn();

  beforeEach(() => {
    fetchMock.restore();
    jest.clearAllMocks();
  });

  it('should intercept a plain url', async () => {
    fetchMock.get('http://someurl.com', { data: 'abc123' });
    interceptFetchCalls(12345, callback);

    const response = await (await global.fetch('http://someurl.com')).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(submitRequest.mock.calls).toMatchSnapshot();
    expect(callback).toHaveBeenCalled();
  });

  it('should intercept a url with custom options', async () => {
    const headers = { some: 'header' };
    const options = {
      method: 'GET',
      headers,
    };

    fetchMock.get('http://someurl.com', { data: 'abc123' }, { headers });
    interceptFetchCalls(12345, callback);

    const response = await (await global.fetch('http://someurl.com', options)).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(submitRequest.mock.calls).toMatchSnapshot();
    expect(callback).toHaveBeenCalled();
  });

  it('should intercept a POST fetch with a json body', async () => {
    const body = { some: 'request body' };
    const headers = { some: 'header' };
    const interceptedCalls = [];

    fetchMock.post('http://someurl.com', { data: 'abc123' }, { headers, body });
    interceptFetchCalls(12345, request => interceptedCalls.push(request));

    const options = {
      method: 'POST',
      headers,
      body,
    };

    const response = await (await global.fetch('http://someurl.com', options)).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(submitRequest.mock.calls).toMatchSnapshot();

    expect(interceptedCalls.length).toBe(1);
    expect(interceptedCalls[0]).toEqual({
      request: {
        url: 'http://someurl.com',
        headers: { some: 'header' },
        method: 'POST',
        content: { some: 'request body' },
      },
      response: {
        headers: undefined,
        statusCode: 200,
        content: { data: 'abc123' },
      },
    });
  });

  it('should log an error to the console when there is a problem submitting request data', async () => {
    fetchMock.get('http://someurl.com', { data: 'abc123' });
    interceptFetchCalls(12345);
    submitRequest.mockImplementation(() => { throw new Error(); });
    global.console = { error: jest.fn() };

    const response = await (await global.fetch('http://someurl.com')).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(global.console.error.mock.calls).toMatchSnapshot();
    expect(callback).not.toHaveBeenCalled();
  });
});
