export function interceptFetchCalls(port) {
    let _fetch = global.fetch;
    global.fetch = function(url, config) {

        // This accounts for times when fetch is called with just the configuration - e.g. fetch(config)
        const actualUrl = config ? url: url.url;

        return _fetch.apply(this, arguments).then(async function(data) {
            try {
                const responseBody = await data.clone().json();
                await submitRequestData(_fetch, actualUrl, config, data, responseBody, port);
            } catch (error) {
                console.log('Error wiretapping fetch request');
                console.log(error);
            }

            return data;
        });
    };
}

async function submitRequestData(_fetch, requestURL, requestConfig, response, responseBody, port) {

    const capturedRequest = {
        request: {
            url: requestURL,
            headers: requestConfig ? requestConfig.headers : undefined,
            method: requestConfig ? requestConfig.method : 'GET',
            content: requestConfig ? requestConfig.body : undefined
        },
        response: {
            headers: response.headers.map,
            statusCode: response.status,
            content: responseBody
        }
    };

    // Using XMLHttpRequest to not interfere with the overwritten fetch object.
    // Sending in a fire-and-forget fashion.
    const request = new XMLHttpRequest();

    request.open('POST', `http://localhost:${port}/requests`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(capturedRequest));
}