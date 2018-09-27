export default async (capturedRequest, port, matched = true) => {
  // Using XMLHttpRequest to not interfere with the overwritten fetch object.
  // Sending in a fire-and-forget fashion.
  const request = new XMLHttpRequest(); // eslint-disable-line no-undef
  const requestUrl = `http://localhost:${port}/${matched ? 'requests' : 'requests/type/unmatched'}`;

  request.open('POST', requestUrl);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(capturedRequest));
};
