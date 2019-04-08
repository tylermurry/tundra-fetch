import escapeRegExp from 'lodash.escaperegexp';
import matcher from 'matcher';

export const WILDCARD_MARKER_ESCAPED = '{{\\*}}';
export const WILDCARD_MARKER = '{{*}}';

export default (source, target) => {
  if (!source || (source || '') === (target || '')) {
    return source === target;
  }
  const asteriskEscapedTarget = target && target.replace(new RegExp(escapeRegExp('*'), 'g'), '\\*');
  const wildcardedSource = source
    .replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
    .replace(new RegExp(escapeRegExp(WILDCARD_MARKER_ESCAPED), 'g'), '*');

  return matcher.isMatch(asteriskEscapedTarget, wildcardedSource);
};
