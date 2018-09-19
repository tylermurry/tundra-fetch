import {Component} from "react";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Input from "@material-ui/core/Input/Input";
import Button from "@material-ui/core/Button/Button";
import React from "react";
import TextField from "@material-ui/core/TextField/TextField";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

export class RequestForm extends Component {

  constructor(props) {
    super(props);

    this.state = this.emptyState();
  }

  emptyState() {
    return {
      method: 'GET',
      url: '',
      headers: '',
      body: '',
    }
  }

  clearForm() {
    this.setState(this.emptyState());
  }

  updateField(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { makeRequest, loading } = this.props;

    return (
      <Card>
        <CardContent>
          <div style={styles.formRow}>

            {/* --- METHOD --- */ }
            <FormControl style={styles.method}>
              <InputLabel>Method</InputLabel>
              <Select
                name="method"
                value={ this.state.method }
                onChange={this.updateField.bind(this)}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PATCH">PATCH</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>

            {/* --- URL --- */ }
            <FormControl style={styles.flexGrow}>
              <InputLabel>URL</InputLabel>
              <Input
                name="url"
                value={ this.state.url }
                onChange={this.updateField.bind(this)}
              />
            </FormControl>
          </div>
          <div style={styles.formRow}>

            {/* --- HEADERS --- */ }
            <TextField
              style={ styles.requestTextField}
              label="Headers"
              defaultValue={ this.state.headers }
              margin="normal"
              variant="outlined"
              rows={5}
              multiline
            />
          </div>
          <div style={styles.formRow}>

            {/* --- BODY --- */ }
            <TextField
              style={ styles.requestTextField}
              label="Body"
              defaultValue={ this.state.body }
              margin="normal"
              variant="outlined"
              rows={9}
              multiline
            />
          </div>
          <div style={styles.buttonRow}>

            { /* --- BUTTONS --- */ }
            <Button
              style={styles.resetButton}
              variant="contained"
              color="default"
              onClick={ this.clearForm.bind(this) }
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={ () => makeRequest(this.state) }
            >
              { loading ? <CircularProgress style={ styles.loading } size={20} /> : "Make Request >" }
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

const styles = ({
  requestTextField: {
    flexGrow: 1,
    fontSize: '8px !important'
  },
  flexGrow: {
    flexGrow: 1
  },
  resetButton: {
    marginRight: 10,
    marginLeft: 'auto',
  },
  method: {
    marginRight: 10,
    minWidth: 90
  },
  formRow: {
    display: 'flex',
    marginBottom: 10,
  },
  buttonRow: {
    display: 'flex',
    marginTop: 20,
  },
  loading: {
    color: 'white',
  }
});
