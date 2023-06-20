import React from "react";
import "../css/Home.css";
import Todos from "../Todos";
import moment from "moment";
import {Paper, Checkbox, Button} from "@material-ui/core";

class Home extends Todos {
  state = {
    todos: [],
    currentTask: "",
    currentDescription: "",
    currentDeadline: "",
  };
  render() {
    const {todos} = this.state;
    return (
      <div className="App" style={{marginTop: "50px"}}>
        <Paper
          elevation={10}
          className="home-container"
          style={{backgroundColor: "lightgrey"}}
        >
          <div className="heading">TodoList</div>
          <form
            onSubmit={this.handleSubmit}
            className="flex flex_column"
            style={{margin: "15px 0"}}
          >
            <input
              value={this.state.currentTask}
              required={true}
              onChange={this.handleChangeTask}
              placeholder="Add Todo"
            />
            <input
              value={this.state.currentDescription}
              required={true}
              onChange={this.handleChangeDes}
              placeholder="Add description"
            />
            <input
              id="datetime-local"
              label="Deadline"
              type="datetime-local"
              required={true}
              value={this.state.currentDeadline}
              onChange={this.handleChangeDeadline}
            />
            <Button
              className="addbtn"
              variant="outlined"
              style={{margin: "8px", backgroundColor: "white"}}
              type="submit"
            >
              Add Todo
            </Button>
          </form>
          <div className="scroll-container">
            {todos.map((todo) => (
              <Paper key={todo._id} className="flex todo_container">
                <Checkbox
                  className="checkbox"
                  checked={todo.completed}
                  onClick={() => this.handleUpdate(todo._id)}
                  color="primary"
                />
                <div>
                  <div
                    className={
                      todo.completed ? "todo line_through task" : "todo task"
                    }
                  >
                    {todo.task}
                  </div>
                  <div
                    className={
                      todo.completed
                        ? "todo line_through description"
                        : "todo description"
                    }
                  >
                    Description: {todo.description}
                  </div>
                  <div
                    className={
                      todo.completed
                        ? "todo line_through deadline"
                        : "todo deadline"
                    }
                  >
                    {moment(todo.deadline).format("hh:mm DD MMM")}
                  </div>
                </div>

                <Button
                  onClick={() => this.handleDelete(todo._id)}
                  color="secondary"
                >
                  delete
                </Button>
              </Paper>
            ))}
          </div>
        </Paper>
      </div>
    );
  }
}

export default Home;
