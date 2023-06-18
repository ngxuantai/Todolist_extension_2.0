import React, {Component} from "react";
import {getLink, addLink} from "./servicces/linkService";
import axios from "axios";

function isValidLink(link) {
  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlPattern.test(link);
}

class Logins extends Component {
  state = {
    link: "",
    username: "",
    password: "",
    showForm: false,
    linkError: false,
  };

  handleChangeLink = (event) => {
    if (isValidLink(event.target.value)) {
      this.setState({linkError: false});
    } else {
      this.setState({linkError: true});
    }
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
    try {
      if (isValidLink(this.state.link)) {
        const {data} = addLink({
          link: this.state.link,
          username: this.state.username,
          password: this.state.password,
        });
        this.setState({link: "", username: "", password: "", showForm: false});
      } else {
        this.setState({linkError: true});
      }
    } catch (error) {
      console.log(error);
    }
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
