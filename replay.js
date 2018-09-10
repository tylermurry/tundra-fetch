import 'url';
import fetchMock from 'fetch-mock';
import escapeRegExp from 'lodash.escaperegexp';
import omit from 'lodash.omit';
import matcher from 'matcher';
import { hashCode } from 'hashcode';

const WILDCARD_MARKER_ESCAPED = '{{\\*}}';

const stringIsSimilarTo = (source, target) => {
  if (source && target) {
    const wildcardedSource = source
      .replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
      .replace(new RegExp(escapeRegExp(WILDCARD_MARKER_ESCAPED), 'g'), '*');

    return matcher.isMatch(target, wildcardedSource);
  }

  return source === target;
};

const buildRequestId = request => hashCode().value(`${request.method} ${JSON.stringify(request.headers)} ${request.url}`);

const buildRequestRepeatMap = (requests) => {
  const repeatMap = [];

  requests.forEach(({ request }) => {
    const requestId = buildRequestId(request);

    if (requestId in repeatMap) {
      repeatMap[requestId].repeated += 1;
    } else {
      repeatMap[requestId] = {
        repeated: 1,
        invocations: 0,
      };
    }
  });

  return repeatMap;
};

const buildFetchMockConfig = (request, config, repeatMap) => {
  const baseConfig = {
    name: buildRequestId(request),
    overwriteRoutes: false,
  };

  const repeatMode = config.repeatMode && config.repeatMode.toUpperCase();

  if (repeatMode === 'FIRST') {
    return baseConfig;
  }

  const { invocations, repeated } = repeatMap[buildRequestId(request)];

  if (invocations >= repeated) {
    if (repeatMode === 'LAST') {
      return baseConfig;
    }
  }

  baseConfig.repeat = 1;

  return baseConfig;
};

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
