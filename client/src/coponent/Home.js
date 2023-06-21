import React from 'react';
import TodoForm from './TodoNorForm';
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
  };
  render() {
    const {todos} = this.state;
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
            className="flex flex_column"
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
          <div>
            {todos.map((todo) => (
              <Paper key={todo._id} className="flex todo_container">
                <Checkbox
                  className="checkbox"
                  checked={todo.completed}
                  onClick={() => this.handleUpdate(todo._id)}
                  color="primary"
                />
                <div onClick={() => this.handleTodoClick(todo._id)}>
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
                    Description: {todo.description}
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
                    {moment(todo.deadline).format('hh:mm DD MMM')}
                  </div>
                  {this.state.selectedId === todo._id ? (
                    // <div className="form-overlay">
                    //   <form className="task-form">
                    //     <div className="heading">Login</div>
                    //     <input />
                    //     <input />
                    //     <input />
                    //     <div className="button-container">
                    //       <button
                    //         className="login-button"
                    //         type="submit"
                    //         variant="outlined"
                    //       >
                    //         Lấy dữ liệu
                    //       </button>
                    //       <button
                    //         className="close-button"
                    //         onClick={this.handleHideForm}
                    //       >
                    //         Đóng
                    //       </button>
                    //     </div>{' '}
                    //   </form>
                    // </div>
                    <TodoForm />
                  ) : (
                    <></>
                  )}
                </div>

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
