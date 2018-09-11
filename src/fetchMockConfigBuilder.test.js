import buildRepeatMap from './requestRepeatMapBuilder';
import fetchMockConfigBuilder from './fetchMockConfigBuilder';
import buildRequestId from './requestIdBuilder';

const buildRequest = (method, url) => ({ request: { method, url } });

describe('fetchMockConfigBuilder', () => {
  const requests = [
    buildRequest('GET', 'http://some.url'),
    buildRequest('GET', 'http://some.url'),
  ];

  it('should build a config when no input config is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];

    // repeatMap[buildRequestId(request)].invocations=

    expect(fetchMockConfigBuilder(request, null, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
      repeat: 1,
    });
  });

  it('should build a config when a repeatMode of \'first\' is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'first' };

    expect(fetchMockConfigBuilder(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
    });
  });

  it('should build a config when a repeatMode of \'last\' is given and invocations do not exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'last' };

    expect(fetchMockConfigBuilder(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
      repeat: 1,
    });
  });

  it('should build a config when a repeatMode of \'last\' is given and invocations exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'last' };

    repeatMap[buildRequestId(request)].invocations = 3;

    expect(fetchMockConfigBuilder(request, config, repeatMap)).toEqual({
      name: 215916126,
      overwriteRoutes: false,
    });
  });
});
