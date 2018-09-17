import extractFetchArguments from './fetchArgumentExtractor';

describe('fetchArgumentUtil', () => {
  it('should extract default fetch arguments', () => {
    expect(extractFetchArguments(['someurl'])).toEqual({
      url: 'someurl',
      config: {
        method: 'GET',
      },
    });
  });

  it('should extract default fetch arguments with explicitly undefined options', () => {
    expect(extractFetchArguments(['someurl', undefined])).toEqual({
      url: 'someurl',
      config: {
        method: 'GET',
      },
    });
  });

  it('should extract fetch arguments with just a request config', () => {
    expect(extractFetchArguments([{ url: 'someurl', method: 'POST' }])).toEqual({
      url: 'someurl',
      config: {
        url: 'someurl',
        method: 'POST',
      },
    });
  });

  it('should extract fetch arguments with a URL and a request config', () => {
    expect(extractFetchArguments(['someurl', { method: 'PUT' }])).toEqual({
      url: 'someurl',
      config: {
        method: 'PUT',
      },
    });
  });

  it('should interpret the arguments as unknown', () => {
    expect(() => extractFetchArguments()).toThrow('Unknown fetch argument configuration: ');
  });
});
