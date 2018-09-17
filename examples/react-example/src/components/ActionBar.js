import {Component} from "react";
import React from "react";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { interceptFetchCalls, replayProfile } from 'tundra-fetch';

export class ActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interceptions: [],
      intercepting: false,
      interceptionListenerStared: false,
    };
  }

  interceptFetches() {
    this.setState({ intercepting: true, interceptions: [] });

    if (!this.state.interceptionListenerStared) {
      interceptFetchCalls(9090, (request) => {
        if (this.state.intercepting) {
          console.log(request);
          this.setState({ interceptions: this.state.interceptions.concat(request) });
        }
      });

      this.setState({ interceptionListenerStared: true });
    }
  }

  stopIntercepting() {
    this.setState({ intercepting: false });
  }

  render() {
    const { intercepting, interceptions } = this.state;
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
            color="default"
            style={styles.actionButton}
          >
            Load Profile A
          </Button>
        </div>
        { intercepting &&
          <div>
            <p>{this.state.interceptions.length} Fetches Intercepted</p>
            <LinearProgress style={styles.progressBar} color="primary" />
          </div>
        }
        { !intercepting && interceptions.length > 0 &&
          <div style={styles.capturedProfileContainer}>
            <p>Captured Profile:</p>
            <textarea
              rows={25}
              style={styles.interceptions}
              defaultValue={ JSON.stringify(this.state.interceptions, null, 2) }
            />
          </div>
        }
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
  interceptions: {
    resize: 'none',
    width: '99%',
    outline: 'none',
    borderColor: '#CCC',
  },
});
