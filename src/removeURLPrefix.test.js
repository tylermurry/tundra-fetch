import removeURLPrefix from './removeURLPrefix';

describe('removeURLPrefix', () => {
  const urlWithoutPrefix = 'someurl.com/something/goes/here?abc=123';

  it('should remove \'http://www.\' from the URL', () => {
    expect(removeURLPrefix(`http://www.${urlWithoutPrefix}`)).toBe(urlWithoutPrefix);
  });

  it('should remove \'www.\' from the URL', () => {
    expect(removeURLPrefix(`www.${urlWithoutPrefix}`)).toBe(urlWithoutPrefix);
  });

  it('should remove nothing from a URL without a prefix', () => {
    expect(removeURLPrefix(urlWithoutPrefix)).toBe(urlWithoutPrefix);
  });

  it('should return null for a url that is null', () => {
    expect(removeURLPrefix(null)).toBe(null);
  });
});
