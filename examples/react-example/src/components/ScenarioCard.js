import Card from "@material-ui/core/Card/Card";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Button from "@material-ui/core/Button/Button";
import PlayArrow from "@material-ui/icons/PlayArrow";
import CardContent from "@material-ui/core/CardContent/CardContent";
import React, {Component} from "react";

export class ScenarioCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scenarioData: null
    }
  }

  async executeScenario(scenario) {
    const response = await fetch(scenario.url, scenario.options);
    const body = await response.json();

    this.setState({ scenarioData: {status: response.status, body: body } });
  }

  render() {
    const { scenario } = this.props;
    const scenarioData = this.state.scenarioData;

    return (
      <div className="Container">
        <Card className="Scenario-Card">
          <CardHeader
            style={styles.cardHeader}
            avatar={
              <Button variant="contained" color="default" onClick={async () => this.executeScenario(scenario)}>
                <PlayArrow/>
              </Button>
            }
            title={scenario.description}
            subheader={`${scenario.method} ${scenario.url}`}
          />
          {scenarioData &&
            <CardContent style={styles.cardContent}>
              <h4 style={styles.status}>{scenarioData.status}</h4>
              <textarea
                rows={15}
                style={styles.scenarioData}
                defaultValue={ JSON.stringify(scenarioData.body, null, 2) }
              />
            </CardContent>
          }
        </Card>
      </div>
    )
  }
}

const styles = ({
  cardHeader: {
    borderBottom: '1px solid #EEE',
    textAlign: 'left'
  },
  status: {
    marginTop: 5,
  },
  cardContent: {
    textAlign: 'left'
  },
  scenarioData: {
    resize: 'none',
    width: '99%',
    outline: 'none',
    borderColor: '#CCC',
  },
});
