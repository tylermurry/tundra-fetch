import buildRequestId from './requestIdBuilder';

export default (request, config, repeatMap) => {
  const baseConfig = {
    name: buildRequestId(request),
    overwriteRoutes: false,
  };

  const repeatMode = config && config.repeatMode && config.repeatMode.toUpperCase();

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
