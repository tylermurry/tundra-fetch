'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.replayProfile = replayProfile;

require('url');

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _lodash = require('lodash.escaperegexp');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omit');

var _lodash4 = _interopRequireDefault(_lodash3);

var _matcher = require('matcher');

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WILDCARD_MARKER_ESCAPED = '{{\\*}}';

var stringIsSimilarTo = function stringIsSimilarTo(source, target) {

    if (source && target) {
        var wildcardedSource = source.replace(new RegExp((0, _lodash2.default)('*'), 'g'), '\\*').replace(new RegExp((0, _lodash2.default)(WILDCARD_MARKER_ESCAPED), 'g'), '*');

        return _matcher2.default.isMatch(target, wildcardedSource);
    } else {
        return source === target;
    }
};

function replayProfile(profileRequests, headersToOmit) {

    _fetchMock2.default.reset();

    profileRequests.forEach(function (_ref) {
        var request = _ref.request,
            response = _ref.response;

        _fetchMock2.default.mock(function (url, opts) {

            var actualOpts = opts ? opts : url;
            var actualUrl = opts ? url : url.url;

            var urlMatches = new RegExp('^(https?://)?(www\\.)?' + (0, _lodash2.default)(request.url) + '$', 'g').test(actualUrl);
            var bodyMatches = actualOpts ? stringIsSimilarTo(request.content, actualOpts.body) : true;
            var headersMatch = actualOpts ? JSON.stringify((0, _lodash4.default)(actualOpts.headers, headersToOmit)) === JSON.stringify((0, _lodash4.default)(request.headers, headersToOmit)) : true;
            var methodMatches = actualOpts ? actualOpts.method === request.method : true;

            return urlMatches && methodMatches && bodyMatches && headersMatch;
        }, {
            body: response.content,
            headers: response.headers,
            status: response.statusCode
        }, {
            name: request.method + ' ' + request.url,
            overwriteRoutes: false
        });
    });
}
//# sourceMappingURL=tundra-replay.js.map