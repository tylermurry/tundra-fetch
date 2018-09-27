"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (requestURL, requestConfig, response, responseBody) {
  return {
    request: {
      url: requestURL,
      headers: requestConfig && requestConfig.headers,
      method: requestConfig && requestConfig.method,
      content: requestConfig && requestConfig.body
    },
    response: response ? {
      headers: response.headers && response.headers.map,
      statusCode: response.status,
      content: responseBody
    } : null
  };
};
//# sourceMappingURL=requestBuilder.js.map