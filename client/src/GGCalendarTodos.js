import {Component} from 'react';
import {
  getTodos,
  addTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
} from './servicces/todoService';
import moment from 'moment';

const CLIENT_ID_GGCALENDAR =
  '273770017764-1nvjjr7fokq6morn7bfg0f2487o89u2r.apps.googleusercontent.com';
const SCOPE =
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly';
const STATE = 'jfkls3n';
const REDIRECT_URI =
  'https://cckhicegpmibbhokfalhcahjikpiilch.chromiumapp.org/';
const RESPONSE_TYPE = 'token';

const createGoogleAuthUrl = () => {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', CLIENT_ID_GGCALENDAR);
  authUrl.searchParams.append('scope', SCOPE);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', STATE);
  authUrl.searchParams.append('response_type', RESPONSE_TYPE);

  return authUrl.toString();
};

const getAccessTokenFromURL = (url) => {
  const params = new URLSearchParams(url.split('#')[1]); // Tách phần query parameters từ URL callback
  return params.get('access_token');
};

const saveAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const clearAccessToken = () => {
  localStorage.removeItem('accessToken');
};

const getListTasksFromCalendar = async (accessToken) => {
  const init = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
    },
  };

  const todos = [];

  await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', init)
    .then((response) => response.json())
    .then(async (lists) => {
      // Xử lý dữ liệu sự kiện từ Google Calendar ở đây
      console.log(lists);
      const queryParams = {
        type: 'ggcalendar',
      };
      await deleteAllTodos(queryParams);
      for (const item of lists.items) {
        console.log(item.id);
        await fetch(
          `https://www.googleapis.com/tasks/v1/lists/${item.id}/tasks`,
          init
        )
          .then((response) => response.json())
          .then(async (tasklists) => {
            // Xử lý dữ liệu của task ở đây
            console.log(tasklists.items);
            // const originalTodos = this.state.todos;
            for (let i = 0; i < tasklists.items.length; i++) {
              console.log(tasklists.items[i].title);
              try {
                const {data} = await addTodo({
                  task: tasklists.items[i].title,
                  description: tasklists.items[i].notes || 'Không có',
                  deadline: moment(tasklists.items[i].due)
                    .startOf('day')
                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                  id_tasklist: item.id,
                  type: 'ggcalendar',
                  id_task: tasklists.items[i].id,
                  completed: tasklists.items[i].status === 'completed',
                });
                console.log(data);
                todos.push(data);
              } catch (error) {
                console.log(error);
              }
            }
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
  console.log(todos);
  return todos;
};

class GGCalendarTodos extends Component {
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

  async componentDidMount() {
    try {
      const queryParams = {
        type: 'ggcalendar',
      };
      const {data} = await getTodos(queryParams);
      this.setState({todos: data});
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  handleRefreshTodos = async () => {
    let access_token = getAccessToken();
    if (access_token) {
      const todos = await getListTasksFromCalendar(access_token);
      this.setState({todos: todos});
    } else {
      this.HandleGetDataFromGoogleCalendar();
    }
  };

  HandleGetDataFromGoogleCalendar = async (event) => {
    let data_todos = [];
    try {
      const redirect_url = await new Promise((resolve) => {
        chrome.identity.launchWebAuthFlow(
          {url: createGoogleAuthUrl(), interactive: true},
          (redirectUrl) => {
            resolve(redirectUrl);
          }
        );
      });
      console.log(redirect_url);
      const accessToken = getAccessTokenFromURL(redirect_url);
      console.log(accessToken);
      saveAccessToken(accessToken);
      data_todos = await getListTasksFromCalendar(accessToken);
      console.log('datatodos', data_todos);
      this.setState({todos: data_todos});
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
      console.log(todos[index]);
      todos[index].completed = !todos[index].completed;

      let status = 'needsAction';
      if (todos[index].completed === true) {
        status = 'completed';
      }
      const tasklist = todos[index].id_tasklist;
      const task = todos[index].id_task;
      const accessToken = getAccessToken();

      this.setState({todos});
      await updateTodo(currentId, todos[index]);

      // Update task on Google Calendar
      const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklist}/tasks/${task}`;

      const requestBody = {
        status: status,
      };

      const init = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      };

      try {
        await fetch(url, init);
        this.setState({textBar: 'Đã cập nhật công việc trên Google Calendar'});
        this.HideSnackbar();
      } catch (error) {
        console.error('Error updating task:', error);
        // return null;
      }
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

export default GGCalendarTodos;
