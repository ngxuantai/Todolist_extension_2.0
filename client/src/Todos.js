import React, {Component} from "react";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "./servicces/todoService";

class Todos extends Component {
  state = {todos: [], currentId: "", currentTask: "", currentDescription: ""};

  async componentDidMount() {
    try {
      const {data} = await getTodos();
      this.setState({todos: data});
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleChangeTask = ({currentTarget: input}) => {
    this.setState({currentTask: input.value});
  };

  handleChangeDes = ({currentTarget: input}) => {
    this.setState({currentDescription: input.value});
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const originalTodos = this.state.todos;
    try {
      const {data} = await addTodo({
        task: this.state.currentTask,
        description: this.state.currentDescription,
      });
      const todos = originalTodos;
      todos.push(data);
      this.setState({todos, currentTask: "", currentDescription: ""});
    } catch (error) {
      console.log(error);
    }
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

export default Todos;
