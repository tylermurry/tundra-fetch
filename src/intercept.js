import extractFetchArguments from './fetchArgumentExtractor';
import submitRequestData from './submitRequest';
import buildRequest from './requestBuilder';

export default (port, callback) => {
  const originalfetch = global.fetch;
  global.fetch = function interceptFetch(...fetchParams) {
    const { url, config } = extractFetchArguments(fetchParams);

    return originalfetch.apply(this, arguments).then(async (data) => { // eslint-disable-line prefer-rest-params
      try {
        const responseBody = await data.clone().json();
        const builtRequest = buildRequest(url, config, data, responseBody);

        await submitRequestData(builtRequest, port);
        if (callback) callback(builtRequest);
      } catch (error) {
        console.error('Error wiretapping fetch request');
        console.error(error);
      }

      return data;
    });
  };
};
