import axois from 'axios';

const API_URL = 'http://localhost:3000/api';

export function getTodos() {
    return axois.get(API_URL + '/todos');
};

export function addTodo(todo) {
    return axois.post(API_URL + '/todos', todo);
};

export function updateTodo (id, todo) {
    return axois.put(API_URL + '/todos/' + id, todo);
};

export function deleteTodo (id) {
    return axois.delete(API_URL + '/todos/' + id);
};

// export const addTodo = async (todo) => {
//     return await axois.post(API_URL + '/todos', todo);
// };

// export const updateTodo = async (id, todo) => {
//     return await axois.put(API_URL + '/todos/' + id, todo);
// };

// export const deleteTodo = async (id) => {
//     return await axois.delete(API_URL + '/todos/' + id);
// };