import 'url';
import fetchMock from 'fetch-mock';
import escapeRegExp from 'lodash.escaperegexp';
import omit from 'lodash.omit';
import buildRequestId from './requestIdBuilder';
import stringIsSimilarTo from './stringSimilarity';
import buildFetchMockConfig from './fetchMockConfigBuilder';
import buildRequestRepeatMap from './requestRepeatMapBuilder';

export default (profileRequests, config) => {
  fetchMock.reset();

  const repeatMap = buildRequestRepeatMap(profileRequests);

  profileRequests.forEach(({ request, response }) => {
    const requestRepeatMap = repeatMap[buildRequestId(request)];
    requestRepeatMap.invocations += 1;

    const matchingFunction = (url, opts) => {
      const actualOpts = opts || url;
      const actualUrl = opts ? url : url.url;
      const actualOptsHeaders = JSON.stringify(omit(actualOpts.headers, config.headersToOmit));
      const actualRequestHeaders = JSON.stringify(omit(request.headers, config.headersToOmit));

      const urlMatches = new RegExp(`^(https?://)?(www\\.)?${escapeRegExp(request.url)}$`, 'g').test(actualUrl);
      const bodyMatches = actualOpts ? stringIsSimilarTo(request.content, actualOpts.body) : true;
      const headersMatch = actualOpts ? actualOptsHeaders === actualRequestHeaders : true;
      const methodMatches = actualOpts ? actualOpts.method === request.method : true;

      return urlMatches && methodMatches && bodyMatches && headersMatch;
    };

    const responseOptions = {
      body: response.content,
      headers: response.headers,
      status: response.statusCode,
    };

    fetchMock.mock(
      matchingFunction,
      responseOptions,
      buildFetchMockConfig(request, config, repeatMap),
    );
  });
};
