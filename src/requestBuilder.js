export default (requestURL, requestConfig, response, responseBody) => ({
  request: {
    url: requestURL,
    headers: requestConfig && requestConfig.headers,
    method: requestConfig && requestConfig.method,
    content: requestConfig && requestConfig.body,
  },
  response: response ? {
    headers: response.headers,
    statusCode: response.status,
    content: responseBody,
  } : null,
});
