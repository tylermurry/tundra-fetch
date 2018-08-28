# Tundra-Fetch
Tundra-fetch is Javascript-based client for the [Tundra server](https://github.com/tylermurry/tundra-cli) that helps  with offline test data management - specifically for projects using the fetch http library.

### Installing the Client
`npm install --save-dev tundra-fetch`

### Using the Client
There are two main uses for the client:

#### Intercepting Fetch Calls
This client is built to intercept all uses of the fetch library and forward them to the Tundra server to be recorded for offline use. To do this, we need to initialize the interceptor when the application starts up and direct it to our server:

```
function someAppInitFunction() {
    require('tundra-fetch').interceptFetchCalls(9090);
}
```
Port `9090` in this case is completely configurable based on what port we start our server on.

The idea is to only enable this code before running a manual test of the app, so *ensure that you remove this before going to production or is toggled off for a production build*

#### Replay
After a profile has been captured, you now have an offline data store that can be replayed during an end-to-end test.

When and where you decide to load the profile is up to the specific needs of your application. However, getting the traffic from the profile to replay during the test execution is as simple as:

```
import {replayProfile} from 'tundra-fetch'
...
loadProfile() {
    replayProfile(require("./fixtures/profiles/scenario1.json"));
}
```

##### Customizing Replay Behavior
For finer-grained control over replay functionality, you may specify an optional `config` parameter. For example:

```
const config = {
  repeatMode: 'last'
}

replayProfile(require("./fixtures/profiles/scenario1.json", config));
```
###### Config options:

| Option | Description |
| ------ | ------ |
| headersToOmit | An array of header keys to ignore (ex. `['Accept-Encoding', 'User-Agent']`)|
| repeatMode | `errorAfterLast` (default): Replay exactly as recorded but throw an error for further requests<br>`first`: Always repeat the first recorded response<br>`last`: Replay exactly as recorded and then repeat the last request forever

#### Using Wildcards to Match Requests
There are times when an application will post dynamic data to an endpoint so that the body will not be *exactly* the same each time (ex. including the current date in the request body). For these scenarios, Tundra provides a special wildcard syntax to allow request bodies to be fuzzy-matched.

For example, let's say you have a profile with the following layout after capturing a request:
```
[
  {
    "request": {
      "url": "https://www.someapi.com/user",
      "headers": { ... }
      },
      "method": "POST",
      "content": "{\"name\":\"John Doe\",\"created\":1533654607}"
    },
    "response": { ... }
  }
]
```
In this case, the `created` property in the content is just the current date, so this will change from request to request. To get around this, you can use `{{*}}`, which acts like a traditional wildcard matcher:
```
...
"content": "{\"name\":\"John Doe\",\"created\":{{*}}}"
...
```

Now the request will be matched, no matter what the value of `created` is.

### Working Example and More
The best way to understand this tool is to see is used in context. For a full, working example look at react-native-tundra (coming soon).

Additionally, it may be helpful to read this article on offline testing for the philosophy behind why Tundra was created: [Test your mobile app offline for lightning fast, reliable automation](https://medium.com/@tylermurry/test-your-mobile-app-offline-for-lightning-fast-reliable-automation-ec579d007dd7)

