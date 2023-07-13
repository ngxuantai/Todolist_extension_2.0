import React from 'react';
import {Paper, Typography, Checkbox, IconButton} from '@material-ui/core';
import {Delete, CalendarToday, Cached} from '@material-ui/icons';
import GGCalendarTodos from '../GGCalendarTodos';
import moment from 'moment';

class GGCalendar extends GGCalendarTodos {
  state = {
    todos: [],
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
          <div className='heading' style={{padding: '4px'}}>
            TodoList
          </div>
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
