import 'url';
import fetchMock from 'fetch-mock';
import omit from 'lodash.omit';
import buildRequestId from './requestIdBuilder';
import stringIsSimilarTo from './stringSimilarity';
import buildFetchMockConfig from './fetchMockConfigBuilder';
import buildRequestRepeatMap from './requestRepeatMapBuilder';
import removeURLPrefix from './removeURLPrefix';
import extractFetchArguments from './fetchArgumentExtractor';
import buildRequest from './requestBuilder';
import submitRequestData from './submitRequest';


const DEFAULT_CONFIG = {
  debuggingEnabled: true,
  debugPort: 9091,
};

const buildResponseOptions = response => ({
  body: response.content,
  headers: response.headers,
  status: response.statusCode,
});

export const matchingFunction = (matchingConfig, request, response) => (_url, _config) => {
  const { url, config } = extractFetchArguments([_url, _config]);
  const headersToOmit = matchingConfig ? matchingConfig.headersToOmit : null;
  const configHeaders = JSON.stringify(omit(config.headers, headersToOmit));
  const requestHeaders = JSON.stringify(omit(request.headers, headersToOmit));

  const urlMatches = stringIsSimilarTo(removeURLPrefix(request.url), removeURLPrefix(url));
  const bodyMatches = config ? stringIsSimilarTo(request.content, config.body) : true;
  const headersMatch = config ? stringIsSimilarTo(requestHeaders, configHeaders) : true;
  const methodMatches = config ? config.method === request.method : true;

  const everythingMatches = urlMatches && methodMatches && bodyMatches && headersMatch;

  if (everythingMatches && matchingConfig && matchingConfig.debuggingEnabled) {
    const responseOptions = buildResponseOptions(response);
    const builtRequest = buildRequest(url, config, responseOptions, responseOptions.body);

    submitRequestData(builtRequest, matchingConfig.debugPort, everythingMatches);
  }

  return everythingMatches;
};

export default (profileName, config) => {
  const user = profileName.toLowerCase();
  let profileRequests = [];
  try {
    profileRequests = config.profileData[user]();
  } catch (e) {
    throw new Error(`No profile found for ${profileName}`);
  }
  fetchMock.reset();

  const defaultedConfig = { ...DEFAULT_CONFIG, ...config };
  const repeatMap = buildRequestRepeatMap(profileRequests);

  profileRequests.forEach(({ request, response }) => {
    const requestRepeatMap = repeatMap[buildRequestId(request)];
    requestRepeatMap.invocations += 1;

    const responseOptions = buildResponseOptions(response);

    fetchMock.mock(
      matchingFunction(defaultedConfig, request, response),
      buildResponseOptions(response),
      buildFetchMockConfig(request, defaultedConfig, repeatMap),
    ).catch(async (...args) => {
      if (defaultedConfig.debuggingEnabled) {
        const { url, config: fetchConfig } = extractFetchArguments(args);
        const builtRequest = buildRequest(url, fetchConfig, responseOptions, responseOptions.body);

        await submitRequestData(builtRequest, defaultedConfig.debugPort, false);
      }

      console.error('Unable to match request');
    });
  });
};
