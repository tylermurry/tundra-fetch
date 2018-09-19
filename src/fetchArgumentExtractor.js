const isString = value => typeof value === 'string' || value instanceof String;

const isObject = value => typeof value === 'object' || value instanceof Object;

export default function (fetchParams) {
  const singleParameter = fetchParams && fetchParams.length === 1;
  const undefinedSecondParameter = fetchParams && fetchParams.length === 2 && fetchParams[1] === undefined;

  if (singleParameter || undefinedSecondParameter) {
    // Scenario: fetch('url')
    if (isString(fetchParams[0])) {
      return {
        url: fetchParams[0],
        config: {
          method: 'GET',
        },
      };
    }
    // Scenario: fetch({ url: 'url', method: 'GET' })
    if (isObject(fetchParams[0])) {
      return {
        url: fetchParams[0].url,
        config: fetchParams[0],
      };
    }
  }

  if (fetchParams && fetchParams.length === 2) {
    // Scenario: fetch('url', { method: 'GET' })
    if (isString(fetchParams[0]) && isObject(fetchParams[1])) {
      return {
        url: fetchParams[0],
        config: fetchParams[1],
      };
    }
  }

  throw Error(`Unknown fetch argument configuration: ${fetchParams}`);
}
