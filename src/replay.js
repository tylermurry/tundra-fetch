import 'url';
import fetchMock from 'fetch-mock';
import omit from 'lodash.omit';
import buildRequestId from './requestIdBuilder';
import stringIsSimilarTo from './stringSimilarity';
import buildFetchMockConfig from './fetchMockConfigBuilder';
import buildRequestRepeatMap from './requestRepeatMapBuilder';
import removeURLPrefix from './removeURLPrefix';
import extractFetchArguments from './fetchArgumentExtractor';

export const matchingFunction = (matchingConfig, request) => (_url, _config) => {
  const { url, config } = extractFetchArguments([_url, _config]);
  const headersToOmit = matchingConfig ? matchingConfig.headersToOmit : null;
  const configHeaders = JSON.stringify(omit(config.headers, headersToOmit));
  const requestHeaders = JSON.stringify(omit(request.headers, headersToOmit));

  const urlMatches = stringIsSimilarTo(removeURLPrefix(request.url), removeURLPrefix(url));
  const bodyMatches = config ? stringIsSimilarTo(request.content, config.body) : true;
  const headersMatch = config ? stringIsSimilarTo(requestHeaders, configHeaders) : true;
  const methodMatches = config ? config.method === request.method : true;

  return urlMatches && methodMatches && bodyMatches && headersMatch;
};

export default (profileRequests, config) => {
  fetchMock.reset();

  const repeatMap = buildRequestRepeatMap(profileRequests);

  profileRequests.forEach(({ request, response }) => {
    const requestRepeatMap = repeatMap[buildRequestId(request)];
    requestRepeatMap.invocations += 1;

    const responseOptions = {
      body: response.content,
      headers: response.headers,
      status: response.statusCode,
    };

    fetchMock.mock(
      matchingFunction(config, request),
      responseOptions,
      buildFetchMockConfig(request, config, repeatMap),
    );
  });
};
