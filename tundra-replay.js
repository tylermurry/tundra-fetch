import 'url';
import fetchMock from 'fetch-mock';
import escapeRegExp from 'lodash.escaperegexp';
import omit from 'lodash.omit';
import matcher from "matcher";

const WILDCARD_MARKER_ESCAPED = '{{\\*}}';

const stringIsSimilarTo = (source, target) => {

    if (source && target) {
        let wildcardedSource = source
            .replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
            .replace(new RegExp(escapeRegExp(WILDCARD_MARKER_ESCAPED), 'g'), '*');

        return matcher.isMatch(target, wildcardedSource);
    }
    else {
        return source === target;
    }
};

export function replayProfile(profileRequests, headersToOmit) {

    fetchMock.reset();

    profileRequests.forEach(({request, response}) => {
        fetchMock.mock((url, opts) => {

            let actualOpts = opts ? opts : url;
            let actualUrl = opts ? url : url.url;

            let urlMatches = new RegExp(`^(https?://)?(www\\.)?${escapeRegExp(request.url)}$`, 'g').test(actualUrl);
            let bodyMatches = actualOpts ? stringIsSimilarTo(request.content, actualOpts.body) : true;
            let headersMatch = actualOpts ? JSON.stringify(omit(actualOpts.headers, headersToOmit)) === JSON.stringify(omit(request.headers, headersToOmit)) : true;
            let methodMatches = actualOpts ? actualOpts.method === request.method: true;

            return urlMatches && methodMatches && bodyMatches && headersMatch;
        }, {
            body: response.content,
            headers: response.headers,
            status: response.statusCode
        },{
            name: `${request.method} ${request.url}`,
            overwriteRoutes: false
        })
    });
}