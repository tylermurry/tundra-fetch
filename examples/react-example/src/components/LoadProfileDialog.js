import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import TextField from "@material-ui/core/TextField/TextField";
import React, {Component} from "react";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

export class LoadProfileDialog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      profile: ''
    }
  }

  loadProfile(profile) {
    try {
      this.props.loadProfile(JSON.parse(profile));
      this.props.close();
    } catch(error) {
      console.error(error);
      alert("There was a problem parsing the profile");
    }
  }

  render() {
    const { open, close } = this.props;
    return (
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle style={{paddingBottom: 0}}>
          <p>Load Profile</p>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            style={{width: '100%'}}
            label="Profile"
            value={this.state.profile}
            onChange={ (event) => this.setState({ profile: event.target.value })}
            margin="normal"
            variant="outlined"
            rows={30}
            multiline
          />
          <div style={{marginTop: '10px', textAlign: 'right'}}>
            <Button variant="contained" color="default" onClick={close} style={{ marginRight: '10px' }}>Close</Button>
            <Button variant="contained" color="primary" onClick={() => this.loadProfile(this.state.profile)}>Load Profile</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}
