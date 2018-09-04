/* eslint-disable global-require */

module.exports = {
  replayProfile: require('./dist/src/replay').default,
  interceptFetchCalls: require('./dist/src/intercept').default,
};
