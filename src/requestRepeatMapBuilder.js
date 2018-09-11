import buildRequestId from './requestIdBuilder';

export default (requests) => {
  const repeatMap = {};

  if (requests) {
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
  }

  return repeatMap;
};
