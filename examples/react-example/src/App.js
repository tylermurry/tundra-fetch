import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Example for Tundra-Fetch</h1>
        </header>
        <div className="App-intro">
          <p>
            The scenarios below demonstrate the core functionality of Tundra in a fetch-based React app
            using <a href="https://reqres.in">reqres.in</a> as the backend REST api.
          </p>
        </div>
        <div className="Container">
          <Card className="Scenario-Card">
            <CardHeader
              title="Scenario 1"
              subheader="Scenario description goes here"
            />
            <CardContent>
              Scenario Details
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
