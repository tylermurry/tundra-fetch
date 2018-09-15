import extractFetchArguments from './fetchArgumentExtractor';

const buildRequest = (requestURL, requestConfig, response, responseBody) => ({
  request: {
    url: requestURL,
    headers: requestConfig.headers,
    method: requestConfig.method,
    content: requestConfig.body,
  },
  response: {
    headers: response.headers.map,
    statusCode: response.status,
    content: responseBody,
  },
});

async function submitRequestData(_fetch, requestURL, requestConfig, response, responseBody, port) {
  const capturedRequest = buildRequest(requestURL, requestConfig, response, responseBody);

  // Using XMLHttpRequest to not interfere with the overwritten fetch object.
  // Sending in a fire-and-forget fashion.
  const request = new XMLHttpRequest(); // eslint-disable-line no-undef

  request.open('POST', `http://localhost:${port}/requests`);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(capturedRequest));
}

export default (port, callback) => {
  const originalfetch = global.fetch;
  global.fetch = function interceptFetch(...fetchParams) {
    const { url, config } = extractFetchArguments(fetchParams);

    return originalfetch.apply(this, arguments).then(async (data) => { // eslint-disable-line prefer-rest-params
      try {
        const responseBody = await data.clone().json();
        await submitRequestData(originalfetch, url, config, data, responseBody, port);
        if (callback) callback(buildRequest(url, config, data, responseBody));
      } catch (error) {
        console.error('Error wiretapping fetch request');
        console.error(error);
      }

      return data;
    });
  };
};
