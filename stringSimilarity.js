import escapeRegExp from 'lodash.escaperegexp';
import matcher from 'matcher';

const WILDCARD_MARKER_ESCAPED = '{{\\*}}';

export default (source, target) => {
  if (source && target) {
    const wildcardedSource = source
      .replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
      .replace(new RegExp(escapeRegExp(WILDCARD_MARKER_ESCAPED), 'g'), '*');

    return matcher.isMatch(target, wildcardedSource);
  }

  return source === target;
};
