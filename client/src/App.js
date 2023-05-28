import './App.css';
import React from 'react';
import Todos from './Todos';
import {Paper, TextField, Checkbox, Button} from '@material-ui/core'

class App extends Todos {
  state = {todos: [], currentTodo: ''};
  render() {
    const {todos} = this.state;
    return (
      <div className="App flex">
        <Paper elevation={3} className="container">
          <div className="heading">Todo_list</div>
          <form 
            onSubmit={this.handleSubmit}
            className="flex"
            style={{margin: "15px 0"}}
          >
            <TextField 
              variant="outlined" 
              size="samll" 
              style = {{width: "80%"}}
              value = {this.state.currentTodo}
              required = {true}
              onChange = {this.handleChange}
              placeholder = "Add Todo"
            />
            {/* <TextField 
              variant="outlined" 
              size="samll" 
              style = {{margin: "80px"}}
              value = {this.state.currentTodo}
              required = {true}
              onChange = {this.handleChange}
              placeholder = "Add Todo"
            /> */}
            <Button 
              style={{height: "100%"}}
              color="primary"
              variant="outlined"
              type="submit"
            >
              Add Todo
            </Button>
          </form>
          <div>
                        {todos.map((todo) => (
                            <Paper
                                key={todo._id}
                                className="flex todo_container"
                            >
                                <Checkbox
                                    checked={todo.completed}
                                    onClick={() => this.handleUpdate(todo._id)}
                                    color="primary"
                                />
                                <div
                                    className={
                                        todo.completed
                                            ? "todo line_through"
                                            : "todo"
                                    }
                                >
                                    {todo.task}
                                </div>
                                <div
                                    className={
                                        todo.completed
                                            ? "todo line_through"
                                            : "todo"
                                    }
                                >
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

export default App;
