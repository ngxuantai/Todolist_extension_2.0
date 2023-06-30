import React, {Component} from 'react';
import {getLink, addLink, refreshTodos} from './servicces/linkService';
import {
  getTodos,
  addTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from './servicces/todoService';
import moment from 'moment';

class UitTodos extends Component {
  state = {
    todos: [],
    link: '',
    username: '',
    password: '',
    getDataForm: false,
    loginStatus: true,
    loading: false,
    selectedId: '',
    task: '',
    description: '',
    deadline: '',
    category: '',
    isRefresh: false,
  };

  async componentDidMount() {
    try {
      const queryParams = {
        type: 'uit',
      };
      const {data} = await getTodos(queryParams);
      this.setState({todos: data});
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleChangeUsername = (event) => {
    this.setState({username: event.target.value});
  };

  handleChangePassword = (event) => {
    this.setState({password: event.target.value});
  };

  handleTodoClick = async (todoId) => {
    this.setState({selectedId: todoId, detailForm: true});
    // await this.handleGetTodo(todoId);
  };

  handleCloseDetailForm = () => {
    this.setState((prevState) => ({
      selectedId: '',
      task: '',
      description: '',
      deadline: '',
      category: '',
      detailForm: !prevState.detailForm,
    }));
  };

  handleRefreshTodos = async () => {
    this.setState({isRefresh: true});
    try {
      const user = await getLink();
      console.log(user.data.data);
      const {data} = await refreshTodos({
        username: user.data.data.username,
        password: user.data.data.password,
      });
      if (data.data.result === 'success') {
        try {
          this.setState({isRefresh: false});
          const queryParams = {
            type: 'uit',
          };
          const {data} = await getTodos(queryParams);
          console.log(data);
          this.setState({todos: data});
          console.log(this.state.todos);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {}
  };

  handleGetTodo = async (todoId) => {
    try {
      const {data} = await getTodoById(todoId);
      console.log(data);
      this.setState({
        task: data.task,
        description: data.description,
        deadline: moment
          .utc(data.deadline)
          .tz('Asia/Ho_Chi_Minh')
          .format('YYYY-MM-DDTHH:mm:ss'),
        category: data.category,
        completed: data.completed,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      this.setState({getDataForm: true, loading: true});
      const {data} = await addLink({
        username: this.state.username,
        password: this.state.password,
      });
      console.log(data);
      if (data.data.result === 'login-fail') {
        this.setState({getDataForm: true, loginStatus: false, loading: false});
      }
      if (data.data.result === 'success') {
        this.setState({getDataForm: false, loginStatus: true, loading: false});
        try {
          const queryParams = {
            type: 'uit',
          };
          const {data} = await getTodos(queryParams);
          this.setState({todos: data});
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleToggleForm = () => {
    this.setState((prevState) => ({
      getDataForm: !prevState.getDataForm,
      loginStatus: true,
    }));
  };

  handleHideForm = () => {
    this.setState({getDataForm: false, username: '', password: ''});
  };

  handleUpdate = async (currentId) => {
    const originalTodos = this.state.todos;
    try {
      const todos = [...originalTodos];
      const index = todos.findIndex((todo) => todo._id === currentId);
      todos[index] = {...todos[index]};
      todos[index].completed = !todos[index].completed;
      this.setState({todos});
      await updateTodo(currentId, todos[index]);
    } catch (error) {
      console.log(error);
      this.setState({todos: originalTodos});
    }
  };

  handleDelete = async (currentTodo) => {
    const originalTodos = this.state.todos;
    try {
      const todos = originalTodos.filter((todo) => todo._id !== currentTodo);
      this.setState({todos});
      await deleteTodo(currentTodo);
    } catch (error) {
      console.log(error);
      this.setState({todos: originalTodos});
    }
  };
}

export default UitTodos;
