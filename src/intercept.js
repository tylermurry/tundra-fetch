import extractFetchArguments from './fetchArgumentExtractor';
import submitRequestData from './submitRequest';
import buildRequest from './requestBuilder';

export default (port, callback) => {
  const originalfetch = global.fetch;
  global.fetch = function interceptFetch(...fetchParams) {
    const { url, config } = extractFetchArguments(fetchParams);

    return originalfetch.apply(this, arguments).then(async (data) => { // eslint-disable-line prefer-rest-params
      const response = await data.clone();

      // This ensures that non-json and null payload can be intercepted.
      const responseBody = await response.json()
        .catch(() => response.body)
        .then(body => body);

      const builtRequest = buildRequest(url, config, data, responseBody);

      // Fetch stores the headers in a map. We need to reset it to the inner map structure to get the right value
      if (builtRequest.response.headers) {
        builtRequest.response.headers = builtRequest.response.headers.map;
      }

      await submitRequestData(builtRequest, port);

      if (callback) callback(builtRequest);

      return data;
    });
  };
};
