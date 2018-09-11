import fetchMock from 'fetch-mock';
import interceptFetchCalls from './intercept';

describe('intercept', () => {
  beforeEach(() => {
    fetchMock.restore();

    const xmlHttpRequestMocks = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
    };

    global.XMLHttpRequest = () => xmlHttpRequestMocks;
  });

  it('should intercept a plain url', async () => {
    fetchMock.get('http://someurl.com', { data: 'abc123' });
    interceptFetchCalls(12345);

    const response = await (await global.fetch('http://someurl.com')).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:12345/requests');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });

  it('should intercept a url with custom options', async () => {
    const headers = { some: 'header' };
    const options = {
      method: 'GET',
      headers,
    };

    fetchMock.get('http://someurl.com', { data: 'abc123' }, { headers });
    interceptFetchCalls(12345);

    const response = await (await global.fetch('http://someurl.com', options)).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:12345/requests');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });

  it('should intercept a POST fetch with a json body', async () => {
    const body = { some: 'request body' };
    const headers = { some: 'header' };

    fetchMock.post('http://someurl.com', { data: 'abc123' }, { headers, body });
    interceptFetchCalls(12345);

    const options = {
      method: 'POST',
      headers,
      body,
    };

    const response = await (await global.fetch('http://someurl.com', options)).json();

    expect(response).toEqual({ data: 'abc123' });
    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:12345/requests');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });
});
