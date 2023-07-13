const Todo = require('../model/todos');
const axios = require('axios');
// const fetch = require('node-fetch');
// import fetch from 'node-fetch';

function getTaskData(accessToken, task_id) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return axios
    .get(
      `https://www.googleapis.com/tasks/v1/lists/@default/tasks/${task_id}`,
      {headers}
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Lỗi khi lấy dữ liệu của task:', error);
      //   throw new Error('Lỗi khi lấy dữ liệu của task');
    });
}

exports.getTaskData = async (req, res) => {
  const {accessToken, task_id} = req.body;
  try {
    const taskData = await getTaskData(accessToken, task_id);
    res.json(taskData);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu của task:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
