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

const checkAccessTokenExpiration = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const data = await response.json();
    console.log(data);

    // Kiểm tra thông tin trong response để xác định trạng thái của accessToken
    const expirationTime = data.expires_in;
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (đơn vị: giây)

    return expirationTime > currentTime;
  } catch (error) {
    console.error('Lỗi khi kiểm tra accessToken:', error);
    return false;
  }
};

const saveAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

const getAccessToken = async () => {
  // return localStorage.getItem('accessToken');
  // if (checkAccessTokenExpiration(localStorage.getItem('accessToken'))) {
  //   return null;
  // }
  try {
    const isExpired = await checkAccessTokenExpiration(
      localStorage.getItem('accessToken')
    );
    if (isExpired) {
      return null;
    }
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Lỗi khi kiểm tra accessToken:', error);
  }
};

const clearAccessToken = () => {
  localStorage.removeItem('accessToken');
};

const getErrorMessage = (error) => {
  if (error.status === 'UNAUTHENTICATED') {
    return 'Không có quyền truy cập';
  }
  return 'Quá trình xảy ra lỗi';
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
    currentTodo: null,
    currentTask: '',
    currentDescription: '',
    currentDeadline: '',
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
    try {
      let access_token = await getAccessToken();
      if (access_token !== null) {
        const todos = await getListTasksFromCalendar(access_token);
        this.setState({todos: todos, textBar: 'Cập nhật dữ liệu thành công'});
        this.HideSnackbar();
      } else {
        console.log('chua co access token');
        this.HandleGetDataFromGoogleCalendar();
      }
    } catch (error) {
      console.error('Lỗi khi làm mới danh sách nhiệm vụ:', error);
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
      if (data_todos.length > 0) {
        console.log('datatodos', data_todos);
        this.setState({todos: data_todos});
        this.setState({textBar: 'Lấy dữ liệu thành công'});
        this.HideSnackbar();
      } else {
        console.log('khong co data');
        this.setState({textBar: 'Không có task trên Google Calendar'});
        this.HideSnackbar();
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeTask = ({currentTarget: input}) => {
    this.setState({currentTask: input.value});
  };

  handleChangeDes = ({currentTarget: input}) => {
    this.setState({currentDescription: input.value});
  };

  handleChangeDeadline = ({currentTarget: input}) => {
    const value = input.value;
    const deadline = value
      ? moment(value).endOf('day').format('YYYY-MM-DDTHH:mm')
      : '00:00';
    this.setState({currentDeadline: deadline});
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let accessToken = await getAccessToken();
    // authorize if not have access token
    if (!accessToken) {
      const redirect_url = await new Promise((resolve) => {
        chrome.identity.launchWebAuthFlow(
          {url: createGoogleAuthUrl(), interactive: true},
          (redirectUrl) => {
            resolve(redirectUrl);
          }
        );
      });
      accessToken = getAccessTokenFromURL(redirect_url);
      saveAccessToken(accessToken);
    }

    const task = {
      title: this.state.currentTask,
      notes: this.state.currentDescription,
      due: moment(this.state.currentDeadline)
        .add(1, 'day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };

    if (this.state.selectedId === '') {
      // Add task to Google Calendar
      const tasklist = '@default';
      const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklist}/tasks`;
      const init = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      };
      try {
        const response = await fetch(url, init);
        const res_data = await response.json();
        console.log(res_data);
        if (res_data.error) {
          const error = getErrorMessage(res_data.error);
          this.setState({textBar: error});
          this.HideSnackbar();
        } else {
          // Add task to database
          const id_tasklist = res_data.selfLink.split('/')[6];
          const {data} = await addTodo({
            task: res_data.title,
            description: res_data.notes,
            deadline: moment(res_data.due)
              .startOf('day')
              .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            id_tasklist: id_tasklist,
            type: 'ggcalendar',
            id_task: res_data.id,
          });
          console.log(data);
          this.setState({
            todos: [...this.state.todos, data],
            textBar: 'Thêm công việc thành công',
            currentTask: '',
            currentDescription: '',
            currentDeadline: '',
          });
          this.HideSnackbar();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const id_tasklist = this.state.currentTodo.id_tasklist;
      const id_task = this.state.currentTodo.id_task;
      const url = `https://tasks.googleapis.com/tasks/v1/lists/${id_tasklist}/tasks/${id_task}`;
      const init = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      };

      try {
        const response = await fetch(url, init);
        const res_data = await response.json();
        console.log(res_data);
        if (res_data.error) {
          const error = getErrorMessage(res_data.error);
          this.setState({textBar: error});
          this.HideSnackbar();
        } else {
          // Update task to database
          const {data} = await updateTodo(this.state.currentTodo._id, {
            task: res_data.title,
            description: res_data.notes,
            deadline: moment(res_data.due)
              .startOf('day')
              .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            id_tasklist: id_tasklist,
            type: 'ggcalendar',
            id_task: res_data.id,
          });
          console.log(data);
          const todos = [...this.state.todos];
          const index = todos.findIndex(
            (todo) => todo._id === this.state.currentTodo._id
          );
          todos[index] = data;
          this.setState({
            todos: todos,
            textBar: 'Cập nhật công việc thành công',
            currentTask: '',
            currentDescription: '',
            currentDeadline: '',
            selectedId: '',
            currentTodo: {},
          });
          this.HideSnackbar();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  handleTodoClick = (id) => {
    this.setState({selectedId: id});
    const todos = [...this.state.todos];
    const index = todos.findIndex((todo) => todo._id === id);
    this.setState({
      currentTodo: todos[index],
      currentTask: todos[index].task,
      currentDescription: todos[index].description,
      currentDeadline: moment(todos[index].deadline)
        .subtract(1, 'day')
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm'),
    });
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
      const accessToken = await getAccessToken();
      console.log(accessToken);

      this.setState({todos});
      await updateTodo(currentId, todos[index]);

      // Update status of task on Google Calendar
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
        const response = await fetch(url, init);
        const res_data = await response.json();
        console.log(res_data);
        if (res_data.error) {
          const error = getErrorMessage(res_data.error);
          this.setState({textBar: error});
          this.HideSnackbar();
        } else {
          this.setState({
            textBar: 'Đã cập nhật công việc trên Google Calendar',
          });
          this.HideSnackbar();
        }
      } catch (error) {
        console.error('Error updating task:', error);
        // return null;
      }
    } catch (error) {
      console.log(error);
      this.setState({todos: originalTodos});
    }
  };

  handleDelete = async (id) => {
    const originalTodos = this.state.todos;
    try {
      const todo = await getTodoById(id);
      if (todo.data.completed === false) {
        this.setState({textBar: 'Không thể xóa công việc chưa hoàn thành'});
        this.HideSnackbar();
        return true;
      }
      const todos = originalTodos.filter((todo) => todo._id !== id);
      this.setState({todos});
      await deleteTodo(id);

      // Delete task on Google Calendar
      const tasklist = todo.data.id_tasklist;
      const task = todo.data.id_task;
      const accessToken = await getAccessToken();

      const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklist}/tasks/${task}`;

      const init = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({deleted: true}),
      };

      try {
        const response = await fetch(url, init);
        const res_data = await response.json();
        if (res_data.error) {
          const error = getErrorMessage(res_data.error);
          this.setState({textBar: error});
          this.HideSnackbar();
        } else {
          this.setState({
            textBar: 'Đã xóa công việc trên Google Calendar',
          });
          this.HideSnackbar();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        // return null;
      }

      // this.setState({textBar: 'Đã xóa công việc'});
      // this.HideSnackbar();
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
