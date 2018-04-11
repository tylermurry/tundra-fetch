# Tundra-Fetch
Tundra-fetch is Javascript-based client for the [Tundra server](https://github.com/tylermurry/tundra-cli) that helps  with offline test data management - specifically for projects using the fetch http library.

### Installing the Client
`npm install --save-dev tundra-fetch`

### Using the Client
There are two main uses for the client:

#### Intercepting Fetch Calls
This client is built to intercept all uses of the fetch library and forward them to the Tundra server to be recorded for offline use. To do this, we need to initialize the interceptor when the application starts up and direct it to our server:

```
import * as Tundra from 'tundra-fetch'
...
function someAppInitFunction() {
    Tundra.interceptFetchCalls(8080);
}
```
Port `8080` in this case is completely configurable based on what port we start our server on.

The idea is to only enable this code before running a manual test of the app, so *ensure that you remove this before going to production or is toggled off for a production build*

#### Replay
After a profile has been captured, you now have an offline data store that can be replayed during an end-to-end test.

When and where you decide to load the profile is up to the specific needs of your application. However, getting the traffic from the profile to replay during the test execution is as simple as:

```
import * as Tundra from 'tundra-fetch'
...
loadProfile() {
    Tundra.replayProfile(require("./fixtures/profiles/scenario1.json"));
}
```
### Working Example and More
The best way to understand this tool is to see is used in context. For a full, working example look at react-native-tundra (coming soon).

Additionally, it may be helpful to read the article on Cold Storage Testing (coming soon) to get the philosophy behind this library and what it's intent is.
