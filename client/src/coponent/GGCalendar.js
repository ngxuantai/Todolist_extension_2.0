import React from 'react';
import {Paper, Typography, Checkbox, IconButton} from '@material-ui/core';
import {Delete, CalendarToday, Cached} from '@material-ui/icons';
import GGCalendarTodos from '../GGCalendarTodos';
import moment from 'moment';

const formatDatetime = (datetime) => {
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const formattedDatetime = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  return formattedDatetime;
};

class GGCalendar extends GGCalendarTodos {
  state = {
    todos: [],
    currentTodo: null,
    currentTask: '',
    currentDescription: '',
    currentDeadline: '',
    detailForm: false,
    loading: false,
    isRefresh: false,
    selectedId: '',
    task: '',
    description: '',
    deadline: '',
    textBar: '',
  };
  render() {
    const {todos, detailForm, loading, isRefresh, selectedId} = this.state;
    return (
      <div className='App' style={{marginTop: '50px'}}>
        <Paper
          elevation={10}
          className='uit-container flex_column'
          style={{backgroundColor: 'lightgrey'}}
        >
          <div
            style={{
              minHeight: '50px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              onClick={() => this.handleRefreshTodos()}
              title='Cập nhật TodoList'
            >
              <Cached />
            </IconButton>
            <button
              className='getdata-button'
              color='primary'
              variant='outlined'
              onClick={this.HandleGetDataFromGoogleCalendar}
            >
              Lấy dữ liệu
            </button>
          </div>
          {/* <div className='heading' style={{padding: '4px'}}>
            TodoList
          </div> */}
          <form
            onSubmit={this.handleSubmit}
            className='flex flex_column form-add'
            style={{marginBottom: '4px'}}
          >
            <input
              value={this.state.currentTask}
              required={true}
              onChange={this.handleChangeTask}
              placeholder='Add Title'
            />
            <input
              value={this.state.currentDescription}
              required={true}
              onChange={this.handleChangeDes}
              placeholder='Add description'
            />
            <input
              id='datetime-local'
              label='Deadline'
              type='datetime-local'
              required={true}
              value={this.state.currentDeadline}
              onChange={this.handleChangeDeadline}
            />
            <button
              className='addbtn'
              variant='outlined'
              style={{margin: '8px', backgroundColor: 'white'}}
              type='submit'
            >
              {this.state.selectedId ? 'Update' : 'Add'}
            </button>
          </form>
          {isRefresh ? (
            <>
              <Paper
                style={{
                  height: '440px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #323232',
                }}
              >
                <div className='spinner'></div>
              </Paper>
            </>
          ) : (
            <div
              className='scroll-container'
              style={{
                maxHeight: '440px',
              }}
            >
              {todos.map((todo) => (
                <Paper key={todo._id} className='flex todo_container'>
                  <Checkbox
                    className='checkbox'
                    checked={todo.completed}
                    onClick={() => this.handleUpdate(todo._id)}
                    color='primary'
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
                      {todo.description != ' '
                        ? todo.description.length > 20
                          ? `${todo.description.substring(0, 20)}...`
                          : todo.description
                        : 'Không có'}
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
                  {/* {detailForm === true && (
                    <TodoUitForm
                      selectedId={selectedId}
                      detailForm={detailForm}
                      close={this.handleCloseDetailForm}
                    />
                  )} */}
                  <IconButton
                    onClick={() => this.handleDelete(todo._id)}
                    color='secondary'
                  >
                    <Delete />
                  </IconButton>
                </Paper>
              ))}
            </div>
          )}
          <div id='snackbar'>{this.state.textBar}</div>
        </Paper>
      </div>
    );
  }
}

export default GGCalendar;
