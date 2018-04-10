import 'url';
import fetchMock from 'fetch-mock';
import escapeRegExp from 'lodash.escaperegexp';

export function replayProfile(profileRequests) {

    fetchMock.reset();

    profileRequests.forEach(({request, response}) => {
        fetchMock.mock((url, opts) => {
            let urlMatches = new RegExp(`^(https?://)?(www\\.)?${escapeRegExp(request.url)}$`, 'g').test(url);
            let bodyMatches = opts ? opts.body === request.content : true;
            let headersMatch = opts ? JSON.stringify(opts.headers) === JSON.stringify(request.headers) : true;
            let methodMatches = opts ? opts.method === request.method: true;

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