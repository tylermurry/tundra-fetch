import React, { Component } from 'react';
import {ActionBar} from "./components/ActionBar";
import {RequestForm} from "./components/RequestForm";
import ResponseSection from "./components/ResponseSection";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      response: {}
    }
  }

  async makeRequest(request) {
    this.setState({ loading: true, response: {} });

    const options = {
      method: request.method ? request.method : null,
      headers: JSON.parse(request.headers),
      body: request.body ? request.body : null,
    };

    const response = await fetch(request.url, options);
    const body = await response.json();

    this.setState({
      loading: false,
      response: {
        status: response.status,
        headers: response.headers,
        body: body
      }
    });
  }

  render() {
    return (
      <div>
        <header style={ styles.appHeader }>
          <h2>React Example for Tundra-Fetch</h2>
        </header>
        <div style={ styles.body }>
          <div style={ styles.appIntro}>
            <p>
              The scenarios below demonstrate the core functionality of Tundra in a fetch-based React app
              using <a href="https://reqres.in">reqres.in</a> as the backend REST api.
            </p>
          </div>
          <ActionBar/>

          <div style={styles.container}>
            <div style={styles.sectionLeft}>
              <h4 style={styles.sectionTitle}>Request</h4>
              <RequestForm loading={ this.state.loading } makeRequest={request => this.makeRequest(request)}
              />
            </div>
            <div style={styles.sectionRight}>
              <h4 style={styles.sectionTitle}>Response</h4>
              <ResponseSection response={this.state.response} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = ({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  sectionTitle: {
    marginBottom: 10
  },
  sectionLeft: {
    width: '100%',
    marginRight: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  sectionRight: {
    width: '100%',
    marginBottom: 10,
    textAlign: 'left',
  },
  body: {
    padding:'0px 50px',
    margin: '0 auto',
    maxWidth: '1300px',
    textAlign: 'center',
  },
  appHeader: {
    textAlign: 'center',
    backgroundColor: '#222',
    padding: '50px',
    color: 'white',
  },
  appIntro: {
    margin: '50px auto',
    fontSize: 'large'
  }
});

export default App;
