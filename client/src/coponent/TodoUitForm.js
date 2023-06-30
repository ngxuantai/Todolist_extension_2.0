import React, {PureComponent} from 'react';
import {getTodoById, updateTodo} from '../servicces/todoService';
import '../css/TodoUitForm.css';
import moment from 'moment';
import 'moment-timezone';

class TodoUitForm extends PureComponent {
  state = {
    task: '',
    category: '',
    description: '',
    deadline: '',
  };

  async componentDidMount() {
    const {selectedId} = this.props;
    if (selectedId) {
      await this.handleGetTodo(selectedId);
    }
  }

  // handleUpdate = async (todoId) => {
  //   try {
  //     const todo = {
  //       task: this.state.task,
  //       description: this.state.description,
  //       deadline: this.state.deadline,
  //     };
  //     await updateTodo(todoId, todo);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  handleGetTodo = async (todoId) => {
    try {
      const {data} = await getTodoById(todoId);
      this.setState({
        task: data.task,
        description: data.description,
        category: data.category,
        deadline: moment
          .utc(data.deadline)
          .tz('Asia/Ho_Chi_Minh')
          .format('YYYY-MM-DDTHH:mm:ss'),
        completed: data.completed,
        mounted: true,
      });
    } catch (error) {}
  };

  handleClose = () => {
    const {close} = this.props;
    close();
  };

  render() {
    const {task, description, deadline, category} = this.state;

    return (
      <div className='form-overlay-detail'>
        <form className='task-form' onSubmit={this.handleClose}>
          <input className='inputTodoForm' value={task || ''} readOnly={true} />
          <input
            className='inputTodoForm'
            value={category || ''}
            readOnly={true}
          />
          <textarea
            className='inputTodoForm'
            value={description == ' ' ? 'Không có' : description}
            readOnly={true}
            rows={description == ' ' ? 1 : 4}
            style={{resize: 'vertical', maxHeight: '220px'}}
          />
          <input
            className='inputTodoForm'
            id='datetime-local'
            label='Deadline'
            type='datetime-local'
            readOnly={true}
            value={deadline}
            style={{resize: 'none'}}
          />
          <div className='button-container'>
            <button className='close-button' type='submit'>
              Đóng
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default TodoUitForm;
