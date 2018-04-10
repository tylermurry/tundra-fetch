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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replayProfile(profileRequests) {

    _fetchMock2.default.reset();

    profileRequests.forEach(function (_ref) {
        var request = _ref.request,
            response = _ref.response;

        _fetchMock2.default.mock(function (url, opts) {
            var urlMatches = new RegExp('^(https?://)?(www\\.)?' + (0, _lodash2.default)(request.url) + '$', 'g').test(url);
            var bodyMatches = opts ? opts.body === request.content : true;
            var headersMatch = opts ? JSON.stringify(opts.headers) === JSON.stringify(request.headers) : true;
            var methodMatches = opts ? opts.method === request.method : true;

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