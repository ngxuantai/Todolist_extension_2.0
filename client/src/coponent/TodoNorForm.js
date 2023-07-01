import React from 'react';
import {getTodoById, updateTodo} from '../servicces/todoService';
import '../css/TodoNorForm.css';
import moment from 'moment';
import 'moment-timezone';

class TodoNorForm extends React.Component {
  state = {
    task: '',
    description: '',
    deadline: '',
    completed: false,
  };

  componentDidMount() {
    const {selectedId} = this.props;
    console.log(selectedId);
    if (selectedId) {
      this.handleGetTodo(selectedId);
    }
  }

  handleChangeTaskTodo = ({currentTarget: input}) => {
    this.setState({task: input.value});
  };

  handleChangeDesTodo = ({currentTarget: input}) => {
    this.setState({description: input.value});
  };

  handleChangeDeadlineTodo = ({currentTarget: input}) => {
    this.setState({deadline: input.value});
  };

  handleGetTodo = async (todoId) => {
    try {
      const {data} = await getTodoById(todoId);
      this.setState({
        task: data.task,
        description: data.description,
        deadline: moment
          .utc(data.deadline)
          .tz('Asia/Ho_Chi_Minh')
          .format('YYYY-MM-DDTHH:mm:ss'),
        completed: data.completed,
      });
      console.log(this.state);
    } catch (error) {}
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    const {selectedId} = this.props;
    const {close} = this.props;
    try {
      const todo = {
        task: this.state.task,
        description: this.state.description,
        deadline: this.state.deadline,
      };
      await updateTodo(selectedId, todo);
      console.log('update success');
      close();
    } catch (error) {
      console.log(error);
    }
  };

  handleClose = () => {
    const {close} = this.props;
    close();
  };

  render() {
    const {task, description, deadline} = this.state;
    const {selectedId} = this.props;

    return (
      <div className='form-overlay'>
        {this.state.completed ? (
          <form className='task-form' onSubmit={this.handleUpdate}>
            <input value={task || ''} readOnly={true} />
            <textarea
              className='inputTodoForm'
              value={description || 'Không có'}
              readOnly={true}
              rows={5}
              style={{resize: 'vertical', maxHeight: '240px'}}
            />
            <input
              id='datetime-local'
              label='Deadline'
              type='datetime-local'
              readOnly={true}
              value={deadline}
              style={{resize: 'none'}}
            />
            <div className='button-container'>
              <button className='close-button'>Đóng</button>
            </div>
          </form>
        ) : (
          <form className='task-form' onSubmit={this.handleUpdate}>
            <input
              value={task || ''}
              required={true}
              onChange={this.handleChangeTaskTodo}
              placeholder='Add Todo'
            />
            <textarea
              value={description == ' ' ? 'Không có' : description}
              required={true}
              onChange={this.handleChangeDesTodo}
              placeholder='Add Description'
              rows={description == ' ' ? 1 : 4}
              style={{resize: 'vertical', maxHeight: '240px'}}
            />
            <input
              className='inputTodoForm'
              id='datetime-local'
              label='Deadline'
              type='datetime-local'
              required={true}
              value={deadline}
              onChange={this.handleChangeDeadlineTodo}
              style={{resize: 'none'}}
            />
            <div className='button-container'>
              <button
                type='submit'
                className='update-button'
                variant='outlined'
              >
                Cập nhật
              </button>
              <button
                className='close-button'
                onClick={() => this.handleClose()}
              >
                Đóng
              </button>
            </div>{' '}
          </form>
        )}
      </div>
    );
  }
}

export default TodoNorForm;
