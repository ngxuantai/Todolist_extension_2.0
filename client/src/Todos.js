import React, { Component } from 'react';
import { getTodos, addTodo, updateTodo, deleteTodo } from './servicces/todoService';

class Todos extends Component {
    state = { todos: [], currentTodo: '' };
  
    async componentDidMount() {
        try {
            const { data } = await getTodos();
            this.setState({ todos: data });
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTodo: input.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const originalTodos = this.state.todos;
        try {
            const { data } = await addTodo({
                task: this.state.currentTodo,
                description: this.state.currentTodo,
            });
            const todos = originalTodos;
            todos.push(data);
            this.setState({ todos, currentTodo: '' });
        } catch (error) {
            console.log(error);
        }
    };

    handleUpdate = async (currentTodo) => {
        const originalTodos = this.state.todos;
        try {
            const todos = [...originalTodos];
            const index = todos.findIndex((todo) => todo._id === currentTodo._id);
            todos[index] = { ...currentTodo };
            todos[index].completed = !todos[index].completed;
            this.setState({ todos });
            await updateTodo (currentTodo._id, todos[index]);
        } catch (error) {
            console.log(error);
            this.setState({ todos: originalTodos });
        }
    };

    handleDelete = async (currentTodo) => {
        const originalTodos = this.state.todos;
        try {
            const todos = originalTodos.filter((todo) => todo._id !== currentTodo._id);
            this.setState({ todos });
            await deleteTodo (currentTodo._id);
        } catch (error) {
            console.log(error);
            this.setState({ todos: originalTodos });
        }
    };
}

export default Todos;