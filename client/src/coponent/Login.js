import React from 'react';
import {Paper, TextField, Button} from '@material-ui/core';
import Logins from '../Auth';
import '../css/Login.css';

class Login extends Logins {
  state = {
    link: '',
    username: '',
    password: '',
    showForm: false,
    linkError: false,
  };
  render() {
    const {link, username, password, showForm, linkError} = this.state;
    return (
      <div className="App" style={{marginTop: '50px'}}>
        <Paper
          elevation={10}
          className="login-container"
          style={{width: '400px', height: '600px'}}
        >
          {showForm && (
            <div className="form-overlay">
              <form onSubmit={this.handleSubmit} className="login-form">
                <div className="heading">Login</div>
                <input
                  value={link}
                  required={true}
                  onChange={this.handleChangeLink}
                  placeholder="Link"
                  error={linkError}
                  helperText={linkError ? 'Please enter a valid link' : ''}
                />
                <input
                  value={username}
                  required={true}
                  onChange={this.handleChangeUsername}
                  placeholder="Username"
                />
                <input
                  type="password"
                  value={password}
                  required={true}
                  onChange={this.handleChangePassword}
                  placeholder="Password"
                />
                <div className="button-container">
                  <button
                    className="login-button"
                    type="submit"
                    variant="outlined"
                  >
                    Lấy dữ liệu
                  </button>
                  <button
                    className="close-button"
                    onClick={this.handleHideForm}
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          )}
          {!showForm && (
            <Button
              style={{margin: '8px', position: 'absolute', top: 0, right: 0}}
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
