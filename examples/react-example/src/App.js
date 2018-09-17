import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {ActionBar} from "./components/ActionBar";
import { ScenarioCard } from "./components/ScenarioCard";
import scenarios from './scenarios';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { scenarios }
  }

  render() {
    const scenarios = this.state.scenarios;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Example for Tundra-Fetch</h1>
        </header>
        <div className="Body">
          <div className="App-intro">
            <p>
              The scenarios below demonstrate the core functionality of Tundra in a fetch-based React app
              using <a href="https://reqres.in">reqres.in</a> as the backend REST api.
            </p>
          </div>
          <ActionBar />

          <ScenarioCard scenario={scenarios[0]} />

        </div>
      </div>
    );
  }
}

export default App;
