import requestIdBuilder from './requestIdBuilder';

describe('requestIdBuilder', () => {
  it('should build a request id', () => {
    expect(requestIdBuilder({
      method: 'GET',
      url: 'http://some.url',
    })).toBe('GET http://some.url');
  });
});
