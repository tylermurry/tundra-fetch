import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import TextField from "@material-ui/core/TextField/TextField";
import React from "react";
import Button from "@material-ui/core/Button/Button";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

export default ({ open, close, intercepts=[] }) => (
  <Dialog open={open} fullWidth maxWidth="md">
    <DialogTitle style={{paddingBottom: 0}}>
      <p>{ intercepts.length } Fetches Intercepted</p>
    </DialogTitle>
    <DialogContent>
      <TextField
        style={{width: '100%'}}
        label="Intercepts"
        value={ JSON.stringify(intercepts, null, 2) }
        margin="normal"
        variant="outlined"
        rows={30}
        multiline
      />
      <div style={{marginTop: '10px', textAlign: 'right'}}>
        <Button variant="contained" color="primary" onClick={ close }>Close</Button>
      </div>
    </DialogContent>
  </Dialog>
)
