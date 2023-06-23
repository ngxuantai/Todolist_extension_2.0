import axois from 'axios';

const API_URL = 'http://localhost:5000';

export function getTodos(queryParams) {
  return axois.get(API_URL + '/todos', {params: queryParams});
}

export function getTodoById(id) {
  return axois.get(API_URL + '/todos/' + id);
}

export function addTodo(todo) {
  return axois.post(API_URL + '/todos', todo);
}

export function updateTodo(id, todo) {
  return axois.put(API_URL + '/todos/' + id, todo);
}

export function deleteTodo(id) {
  return axois.delete(API_URL + '/todos/' + id);
}
