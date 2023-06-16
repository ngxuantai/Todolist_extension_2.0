import React, {Component} from "react";

class Logins extends Component {
  state = {link: "", username: "", password: "", showForm: false};

  handleChangeLink = (event) => {
    this.setState({link: event.target.value});
  };

  handleChangeUsername = (event) => {
    this.setState({username: event.target.value});
  };

  handleChangePassword = (event) => {
    this.setState({password: event.target.value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Your login logic here
  };

  handleToggleForm = () => {
    this.setState((prevState) => ({
      showForm: !prevState.showForm,
    }));
  };

  handleHideForm = () => {
    this.setState({showForm: false});
  };
}

export default Logins;
