import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import React from "react";
import TextField from "@material-ui/core/TextField";

export default ({ response }) => (
  <Card>
    <CardContent>
      <h4 style={ styles.status }>Status: {response.status }</h4>
      <div style={ styles.headerRow }>
        <TextField
          style={ styles.responseTextField}
          label="Headers"
          value={ JSON.stringify(response.headers) }
          defaultValue={" "}
          margin="normal"
          variant="outlined"
          rows={5}
          multiline
        />
      </div>
      <div style={ styles.bodyRow }>
        <TextField
          style={ styles.responseTextField }
          label="Body"
          value={ JSON.stringify(response.body) }
          defaultValue={" "}
          margin="normal"
          variant="outlined"
          rows={12}
          multiline
        />
      </div>
    </CardContent>
  </Card>
)

const styles = {
  responseTextField: {
    flexGrow: 1,
  },
  status: {
    marginBottom: 18
  },
  headerRow: {
    marginTop: 10,
    display: 'flex'
  },
  bodyRow: {
    marginBottom: 0,
    marginTop: 10,
    display: 'flex'
  }
}
