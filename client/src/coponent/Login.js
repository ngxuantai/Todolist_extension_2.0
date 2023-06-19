import React from "react";
import {Paper, TextField, Button} from "@material-ui/core";
import Logins from "../Auth";
import "../css/Login.css";

class Login extends Logins {
  state = {
    link: "",
    username: "",
    password: "",
    showForm: false,
    linkError: false,
  };
  render() {
    const {link, username, password, showForm, linkError} = this.state;
    return (
      <div className="App" style={{marginTop: "50px"}}>
        <Paper
          elevation={10}
          className="login-container"
          style={{width: "400px", height: "600px"}}
        >
          {showForm && (
            <div className="form-overlay">
              <form onSubmit={this.handleSubmit} className="login-form">
                <Button className="close-button" onClick={this.handleHideForm}>
                  X
                </Button>
                <TextField
                  variant="outlined"
                  style={{width: "80%", margin: "8px"}}
                  value={link}
                  required={true}
                  onChange={this.handleChangeLink}
                  placeholder="Link"
                  error={linkError}
                  helperText={linkError ? "Please enter a valid link" : ""}
                />
                <TextField
                  variant="outlined"
                  style={{width: "80%", margin: "8px"}}
                  value={username}
                  required={true}
                  onChange={this.handleChangeUsername}
                  placeholder="Username"
                />
                <TextField
                  variant="outlined"
                  style={{width: "80%", margin: "8px"}}
                  value={password}
                  required={true}
                  onChange={this.handleChangePassword}
                  placeholder="Password"
                />
                <Button
                  style={{height: "100%", margin: "8px"}}
                  color="primary"
                  variant="outlined"
                  type="submit"
                >
                  Lấy dữ liệu
                </Button>
              </form>
            </div>
          )}
          {!showForm && (
            <Button
              style={{margin: "8px", position: "absolute", top: 0, right: 0}}
              color="primary"
              variant="outlined"
              onClick={this.handleToggleForm}
            >
              Đăng nhập
            </Button>
          )}
        </Paper>
      </div>
    );
  }
}

export default Login;
