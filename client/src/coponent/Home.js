import React from 'react';
import TodoNorForm from './TodoNorForm';
import '../css/Home.css';
import Todos from '../Todos';
import moment from 'moment';
import {Paper, Checkbox, IconButton} from '@material-ui/core';
import {Delete, CalendarToday} from '@material-ui/icons';

class Home extends Todos {
  state = {
    todos: [],
    currentTask: '',
    currentDescription: '',
    currentDeadline: '',
    selectedId: '',
    closeForm: true,
  };
  render() {
    const {todos, selectedId} = this.state;
    return (
      <div className="App" style={{marginTop: '50px'}}>
        <Paper
          elevation={10}
          className="home-container"
          style={{backgroundColor: 'lightgrey'}}
        >
          <div className="heading">TodoList</div>
          <form
            onSubmit={this.handleSubmit}
            className="flex flex_column form-add"
            style={{margin: '15px 0'}}
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
            <button
              className="addbtn"
              variant="outlined"
              style={{margin: '8px', backgroundColor: 'white'}}
              type="submit"
            >
              Add Todo
            </button>
          </form>
          <div style={{gap: '5px'}}>
            {todos.map((todo) => (
              <Paper key={todo._id} className="flex todo_container">
                <Checkbox
                  className="checkbox"
                  checked={todo.completed}
                  onClick={() => this.handleUpdate(todo._id)}
                  color="primary"
                />
                <div
                  onClick={() => this.handleTodoClick(todo._id)}
                  style={{marginTop: '5px'}}
                >
                  <div
                    className={
                      todo.completed ? 'todo line_through task' : 'todo task'
                    }
                  >
                    {todo.task}
                  </div>
                  <div
                    className={
                      todo.completed
                        ? 'todo line_through description'
                        : 'todo description'
                    }
                  >
                    Description:{' '}
                    {todo.description && todo.description.length > 20
                      ? `${todo.description.substring(0, 10)}...`
                      : todo.description || 'Không có'}
                  </div>
                  <div
                    className={
                      todo.completed
                        ? 'todo line_through deadline'
                        : 'todo deadline'
                    }
                  >
                    <CalendarToday
                      style={{fontSize: '15px', margin: '0px 5px 5px 0px'}}
                    />
                    {moment(todo.deadline).format('HH:mm DD MMM')}
                  </div>
                </div>
                {!this.state.closeForm && (
                  <TodoNorForm
                    selectedId={selectedId}
                    close={this.handleCloseForm}
                  />
                )}
                <IconButton
                  onClick={() => this.handleDelete(todo._id)}
                  color="secondary"                  
                >
                  <Delete />
                </IconButton>
              </Paper>
            ))}
          </div>
        </Paper>
      </div>
    );
  }
}

export default Home;
