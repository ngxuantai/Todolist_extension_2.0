import React from "react";
import "../css/App.css";
import Todos from "../Todos";
import {Paper, TextField, Checkbox, Button} from "@material-ui/core";

class Home extends Todos {
  state = {todos: [], currentTask: "", currentDescription: ""};
  render() {
    const {todos} = this.state;
    return (
      <div className="App" style={{marginTop: "60px"}}>
        <Paper elevation={10} className="container">
          <div className="heading">Todo_list</div>
          <form
            onSubmit={this.handleSubmit}
            className="flex flex_column"
            style={{margin: "15px 0"}}
          >
            <TextField
              variant="outlined"
              size="samll"
              style={{width: "80%", margin: "8px"}}
              value={this.state.currentTask}
              required={true}
              onChange={this.handleChangeTask}
              placeholder="Add Todo"
            />
            <TextField
              variant="outlined"
              size="samll"
              style={{width: "80%", margin: "8px"}}
              value={this.state.currentDescription}
              required={true}
              onChange={this.handleChangeDes}
              placeholder="Add description"
            />
            <Button
              className="addbtn"
              style={{height: "100%", margin: "8px", float: "right"}}
              color="primary"
              variant="outlined"
              type="submit"
            >
              Add Todo
            </Button>
          </form>
          <div>
            {todos.map((todo) => (
              <Paper key={todo._id} className="flex todo_container">
                <Checkbox
                  checked={todo.completed}
                  onClick={() => this.handleUpdate(todo._id)}
                  color="primary"
                />
                <div className={todo.completed ? "todo line_through" : "todo"}>
                  {todo.task}
                </div>
                <div className={todo.completed ? "todo line_through" : "todo"}>
                  {todo.description}
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
