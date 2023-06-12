import React from "react";
import {Paper, TextField, Button} from "@material-ui/core";
import Logins from "../Login";

class Login extends Logins {
  state = {link: "", username: "", password: "", showForm: false};
  render() {
    const {link, username, password, showForm} = this.state;
    return (
      <div className="App" style={{marginTop: "60px"}}>
        <Paper elevation={10} className="container">
          <Button
            style={{height: "100%", margin: "8px", float: "right"}}
            color="primary"
            variant="outlined"
            onClick={this.handleToggleForm}
          >
            {showForm ? "Ẩn form" : "Lấy dữ liệu"}
          </Button>
          {showForm && ( // Render the form only when showForm is true
            <form
              onSubmit={this.handleSubmit}
              className="flex flex_column"
              style={{margin: "15px 0"}}
            >
              <TextField
                variant="outlined"
                size="small"
                style={{width: "80%", margin: "8px"}}
                value={username}
                required={true}
                onChange={this.handleChangeUsername}
                placeholder="Username"
              />
              <TextField
                variant="outlined"
                size="small"
                style={{width: "80%", margin: "8px"}}
                value={password}
                required={true}
                onChange={this.handleChangePassword}
                placeholder="Password"
              />
              <Button
                className="addbtn"
                style={{height: "100%", margin: "8px", float: "right"}}
                color="primary"
                variant="outlined"
                type="submit"
              >
                Login
              </Button>
            </form>
          )}
        </Paper>
      </div>
    );
  }
}

export default Login;
