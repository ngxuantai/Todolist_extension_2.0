const {model} = require('mongoose');
const Todo = require('../model/todos');
const nodemailer = require('nodemailer');
const {OAuth2Client} = require('google-auth-library');
const Nofitied = require('../model/notified');
const moment = require('moment');

const sendNotificationEmails = async (todosToNotify, notified) => {
  try {
    // Tạo OAuth2 client
    const oauth2Client = new OAuth2Client(
      '455449749063-uonqsmcpgk9fo0kqt31vlp78tg9manv1.apps.googleusercontent.com',
      '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'
    );

    // Đặt refresh token
    oauth2Client.setCredentials({
      refresh_token:
        '1//04V9xDkkIHsHoCgYIARAAGAQSNwF-L9IreRZ0OQnBglb9yTljj4COJcVEVv04st7zHbXag7KFAXkp__H5PwCflJoIvrgEaUSoF-I',
    });

    // Lấy thông tin công việc từ cơ sở dữ liệu
    const todos = await Todo.find({_id: {$in: todosToNotify}});

    // Tạo access token từ refresh token
    const accessToken = await oauth2Client.getAccessToken();

    // Kết nối tới dịch vụ gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'xuantai1902@gmail.com',
        accessToken,
        clientId:
          '455449749063-uonqsmcpgk9fo0kqt31vlp78tg9manv1.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04R_c0ySHxiOQCgYIARAAGAQSNwF-L9Ir87g4wlm-br5YZwYx-ePEXt7091Ch8Yb5ydDgYpHPeLlWfW5I29ToP8qJUgKxW63gFo8',
      },
    });

    // Gửi email thông báo cho từng công việc
    for (const todo of todos) {
      const deadline = moment(todo.deadline).utcOffset(7); // Đặt khung giờ Việt Nam (UTC+7)
      const formattedDeadline = deadline.format('HH:mm DD/MM/YYYY');
      const mailOptions = {
        to: notified.email,
        subject: 'Thông báo công việc sắp đến hạn',
        text: `Công việc "${todo.task}" sẽ đến hạn vào ngày ${formattedDeadline}`,
      };

      // Gửi email thông báo
      await transporter.sendMail(mailOptions);
      console.log(`Đã gửi email thông báo cho công việc ${todo._id}`);
    }
    return 'success';
  } catch (error) {
    console.error('Lỗi khi gửi email thông báo:', error);
    return 'error';
  }
};

const scheduleTodo = (type) => {
  setInterval(async () => {
    const queryParams = {
      type: type,
    };
    const notified = await Nofitied.findOne(queryParams);

    // Lấy thời gian hiện tại và thời gian sắp đến hạn
    const currentTime = new Date();
    const upcomingDateTime = new Date(
      currentTime.getTime() + notified.time * 60000
    );

    try {
      // Truy vấn trong cơ sở dữ liệu các công việc có thời hạn sắp đến
      const upcomingTodos = await Todo.find({
        type: type,
        deadline: {$lte: upcomingDateTime},
        completed: false,
        isNotified: false,
      });

      // Lưu lại danh sách công việc cần gửi thông báo
      const todosToNotify = upcomingTodos.map((todo) => todo._id);

      // Tiến hành gửi thông báo cho danh sách công việc cần thông báo
      const result = await sendNotificationEmails(todosToNotify, notified);
      if (result === 'success') {
        try {
          await Todo.updateMany(
            {_id: {$in: todosToNotify}}, // Điều kiện tìm kiếm
            {$set: {isNotified: true}} // Dữ liệu cập nhật
          );
        } catch (error) {
          console.error('Lỗi khi cập nhật trạng thái công việc:', error);
        }
      }
      // console.log(upcomingTodos);
      // console.log('Danh sách công việc cần thông báo:', todosToNotify);
    } catch (error) {
      console.error('Lỗi khi truy vấn danh sách công việc:', error);
    }
    // Gọi hàm kiểm tra công việc và gửi email thông báo ở đây
  }, 60000); // 60000ms = 1 phút
};

module.exports = {scheduleTodo};
