import fetchMock from 'fetch-mock';
import submitRequest from './submitRequest';

describe('submitRequest', () => {
  beforeEach(() => {
    fetchMock.restore();

    const xmlHttpRequestMocks = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
    };

    global.XMLHttpRequest = () => xmlHttpRequestMocks;
  });

  it('should send the matched request properly', () => {
    submitRequest({ request: 'data' }, 123, true);

    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:123/requests');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });

  it('should send the unmatched request properly', () => {
    submitRequest({ request: 'data' }, 123, false);

    expect(global.XMLHttpRequest().open).toBeCalledWith('POST', 'http://localhost:123/requests/type/unmatched');
    expect(global.XMLHttpRequest().setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(global.XMLHttpRequest().send).toMatchSnapshot();
  });
});
