import {Component} from "react";
import React from "react";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { interceptFetchCalls, replayProfile } from 'tundra-fetch';
import InterceptsDialog from "./InterceptsDialog";
import {LoadProfileDialog} from "./LoadProfileDialog";

export class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intercepts: [],
      intercepting: false,
      interceptsDialogVisible: false,
      loadProfileDialogVisible: false,
      interceptionListenerStared: false,
    };
  }

  interceptFetches() {
    this.setState({ intercepting: true, intercepts: [] });

    if (!this.state.interceptionListenerStared) {
      interceptFetchCalls(0, (request) => {
        if (this.state.intercepting) {
          console.log(request);
          this.setState({ intercepts: this.state.intercepts.concat(request) });
        }
      });

      this.setState({ interceptionListenerStared: true });
    }
  }

  stopIntercepting() {
    const updatedState = {
      intercepting: false
    };

    if (this.state.intercepts.length > 0) {
      updatedState.interceptsDialogVisible = true
    }

    this.setState(updatedState);
  }

  render() {
    const { intercepting, intercepts, interceptsDialogVisible, loadProfileDialogVisible } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            style={styles.actionButton}
            onClick={ intercepting ?
              this.stopIntercepting.bind(this) :
              this.interceptFetches.bind(this)
            }
          >
            { intercepting ? "Done" : "Intercept Fetches" }
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={styles.actionButton}
            onClick={ () => this.setState({ loadProfileDialogVisible: true })}
          >
            Load Profile
          </Button>
        </div>
        { intercepting &&
          <div>
            <p>{ intercepts.length} Fetches Intercepted</p>
            <LinearProgress style={styles.progressBar} color="primary" />
          </div>
        }

        <InterceptsDialog
          open={ interceptsDialogVisible }
          close={ () => this.setState({ interceptsDialogVisible: false}) }
          intercepts={ intercepts }
        />

        <LoadProfileDialog
          open={ loadProfileDialogVisible }
          close={ () => this.setState({ loadProfileDialogVisible: false}) }
          loadProfile={ (profile) => replayProfile(profile) }
        />

      </div>
    )
  }
}

const styles = ({
  container: {
    paddingBottom: '5px',
  },
  capturedProfileContainer: {
    textAlign: 'left'
  },
  actionButton: {
    marginRight: '10px'
  },
  progressBar: {
    marginBottom: '5px'
  },
  buttonContainer: {
    textAlign: 'left',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  intercepts: {
    resize: 'none',
    width: '99%',
    outline: 'none',
    borderColor: '#CCC',
  },
});
