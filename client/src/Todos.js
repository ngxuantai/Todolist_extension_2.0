import React, {Component} from 'react';
import {
  getTodos,
  addTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from './servicces/todoService';

const clientId =
  '273770017764-1nvjjr7fokq6morn7bfg0f2487o89u2r.apps.googleusercontent.com';
const scope =
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly';
// const redirectUri = chrome.identity.getRedirectURL();
const state = encodeURIComponent('jfkls3n');
let redirectUri = 'https://cckhicegpmibbhokfalhcahjikpiilch.chromiumapp.org/';
// gắn thêm "/provider_cb" vào redirectUri để chạy được
// redirectUri += 'provider_cb';
// const state = 'YOUR_STATE';

const getAccessTokenFromURL = (url) => {
  const params = new URLSearchParams(url.split('#')[1]); // Tách phần query parameters từ URL callback
  return params.get('access_token');
};

const getListTasksFromCalendar = (accessToken) => {
  const init = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', init)
    .then((response) => response.json())
    .then(async (data) => {
      // Xử lý dữ liệu sự kiện từ Google Calendar ở đây
      console.log(data);
      for (let i = 0; i < data.items.length; i++) {
        console.log(data.items[i].id);
        fetch(
          `https://www.googleapis.com/tasks/v1/lists/${data.items[i].id}/tasks`,
          // `https://tasks.googleapis.com/tasks/v1/users/@me/lists/MDQ5Mjg0MjU2MDQxOTk1NjY1NzI6MDow/tasks`,
          init
        )
          .then((response) => response.json())
          .then((data) => {
            // Xử lý dữ liệu của task ở đây
            console.log(data);
          })
          .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu của task:', error);
            return null;
          });
      }
    })
    .catch((error) => {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
    });
};

const getTaskData = async (task_id, accessToken) => {
  console.log(accessToken);
  const init = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
  };

  return fetch(
    // `https://www.googleapis.com/tasks/v1/users/@me/lists/@default/tasks/${task_id}`,
    // `https://tasks.googleapis.com/tasks/v1/users/@me/lists/MDQ5Mjg0MjU2MDQxOTk1NjY1NzI6MDow/tasks`,
    init
  )
    .then((response) => response.json())
    .then((data) => {
      // Xử lý dữ liệu của task ở đây
      return data;
    })
    .catch((error) => {
      console.error('Lỗi khi lấy dữ liệu của task:', error);
      return null;
    });
};

const createGoogleAuthUrl = () => {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('response_type', 'token');

  return authUrl.toString();
};

class Todos extends Component {
  state = {
    todos: [],
    currentId: '',
    currentTask: '',
    currentDescription: '',
    currentDeadline: '',
    selectedId: '',
    closeForm: true,
    textBar: '',
  };

  async componentDidMount() {
    try {
      const queryParams = {
        type: 'normal',
      };
      const {data} = await getTodos(queryParams);
      this.setState({todos: data});
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleOpenNotifiedForm = () => {
    this.setState({notifiedForm: true});
  };

  handleCloseNotifiedForm = () => {
    this.setState({notifiedForm: false});
  };

  handleChangeTask = ({currentTarget: input}) => {
    this.setState({currentTask: input.value});
  };

  handleChangeDes = ({currentTarget: input}) => {
    this.setState({currentDescription: input.value});
  };

  handleChangeDeadline = ({currentTarget: input}) => {
    this.setState({currentDeadline: input.value});
  };

  handleTodoClick = (todoId) => {
    this.setState({selectedId: todoId, closeForm: false});
  };

  handleCloseForm = async () => {
    try {
      const originalTodos = this.state.todos;
      const todos = [...originalTodos];
      const index = todos.findIndex(
        (todo) => todo._id === this.state.selectedId
      );
      const {data} = await getTodoById(this.state.selectedId);
      todos[index] = data;
      this.setState({todos: todos, closeForm: true});
    } catch (error) {
      console.log(error);
    }
  };

  handleSubmit = async (event) => {
    // console.log('submit');
    // try {
    //   // chrome.identity.getAuthToken({interactive: true}, function (token) {
    //   //   console.log(token);
    //   // });
    //   // createGoogleAuthUrl();
    //   // chrome.tabs.create({url: createGoogleAuthUrl()});
    //   chrome.identity.launchWebAuthFlow(
    //     {url: createGoogleAuthUrl(), interactive: true},
    //     function (redirect_url) {
    //       console.log(redirect_url);
    //       const accessToken = getAccessTokenFromURL(redirect_url);
    //       console.log(accessToken);
    //       getListTasksFromCalendar(accessToken);
    //       // getTaskData('MDQ5Mjg0MjU2MDQxOTk1NjY1NzI6MDow', accessToken);
    //     }
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
    event.preventDefault();
    const originalTodos = this.state.todos;
    try {
      const {data} = await addTodo({
        type: 'normal',
        task: this.state.currentTask,
        description: this.state.currentDescription,
        deadline: this.state.currentDeadline,
      });
      console.log(data);
      const todos = originalTodos;
      todos.push(data);
      this.setState({
        todos,
        currentTask: '',
        currentDescription: '',
        currentDeadline: '',
      });
      this.setState({textBar: 'Thêm công việc thành công'});
      this.HideSnackbar();
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
      const todo = await getTodoById(currentTodo);
      if (todo.data.completed === false) {
        this.setState({textBar: 'Không thể xóa công việc chưa hoàn thành'});
        this.HideSnackbar();
        return true;
      }
      const todos = originalTodos.filter((todo) => todo._id !== currentTodo);
      this.setState({todos});
      await deleteTodo(currentTodo);
    } catch (error) {
      console.log(error);
      this.setState({todos: originalTodos});
    }
  };

  HideSnackbar = () => {
    var x = document.getElementById('snackbar');
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 3000);
  };
}

export default Todos;
