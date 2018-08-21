import 'url';
import fetchMock from 'fetch-mock';
import escapeRegExp from 'lodash.escaperegexp';
import omit from 'lodash.omit';
import matcher from 'matcher';

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

export default (profileRequests, headersToOmit) => {
  fetchMock.reset();

  profileRequests.forEach(({ request, response }) => {

    const matchingFunction = (url, opts) => {
      const actualOpts = opts || url;
      const actualUrl = opts ? url : url.url;
      const actualOptsHeaders = JSON.stringify(omit(actualOpts.headers, headersToOmit));
      const actualRequestHeaders = JSON.stringify(omit(request.headers, headersToOmit));

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

    const fetchMockConfig = {
      name: `${request.method} ${request.url}`,
      overwriteRoutes: false,
    };

    fetchMock.mock(matchingFunction, responseOptions, fetchMockConfig);
  });
};
