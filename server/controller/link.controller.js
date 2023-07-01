const Link = require('../model/link');
const Todo = require('../model/todos');
const Nofitied = require('../model/notified');
const puppeteer = require('puppeteer');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const {promisify} = require('util');
const {type} = require('os');

const filePath = 'calendar.ics';
const readFileAsync = promisify(fs.readFile);

function parseICalData(icsData) {
  const lines = icsData.split('\n');

  const Todos = [];
  let currentTodo = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('BEGIN:VEVENT')) {
      currentTodo = {};
    } else if (line.startsWith('END:VEVENT')) {
      Todos.push(currentTodo);
    } else if (line.startsWith('SUMMARY:')) {
      currentTodo.task = line.substring('SUMMARY:'.length);
    } else if (line.startsWith('DESCRIPTION:')) {
      let description = line.substring('DESCRIPTION:'.length);
      i++;
      while (!lines[i].startsWith('CLASS:')) {
        description += lines[i].trim();
        i++;
      }
      currentTodo.description = formatDescription(description);
    } else if (line.startsWith('CATEGORIES:')) {
      currentTodo.category = line.substring('CATEGORIES:'.length);
    } else if (line.startsWith('DTEND:')) {
      currentTodo.deadline = line.substring('DTEND:'.length);
    }
  }

  return Todos;
}

function formatDescription(description) {
  description = description
    .replace(/\\n\\n/g, '. ') // Thay thế '\n\n' liên tiếp thành '. '
    .replace(/\\n/g, '. ') // Thay thế '\n' bằng '. '
    .replace(/\\+/g, '') // Xóa dấu '\'
    .replace(/\.+/g, '.') // Xóa các dấu '.' liên tục thành 1 dấu '.'
    .replace(/\=+/g, '') // Xóa các dấu '=' liên tục
    .trim() // Loại bỏ kí tự trắng từ đầu và cuối chuỗi
    .replace(/^\.*/, ''); // Xóa các dấu '.' từ đầu chuỗi
  return description;
}

const getTodosFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {responseType: 'stream'});
    await response.data.pipe(fs.createWriteStream(filePath));
    console.log('Đã tải tệp .ics thành công');

    const data = await readFileAsync(filePath, 'utf8');
    const Todos = parseICalData(data);

    await Todo.deleteMany({type: 'uit'});

    for (const todo of Todos) {
      const deadline = moment(todo.deadline, 'YYYYMMDDTHHmmssZ').format(
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      );
      await new Todo({
        type: 'uit',
        task: todo.task,
        description: todo.description.toString() || ' ',
        category: todo.category,
        deadline: deadline,
      }).save();
      console.log('Lưu thành công');
    }

    console.log('Tất cả các todo đã được lưu thành công.');
    // xóa file
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
    return false;
  }
};

const getData = async (link) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins'],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://courses.uit.edu.vn/login/index.php');

    await page.type('#username', link.username);
    await page.type('#password', link.password);
    await Promise.all([page.click('#loginbtn'), page.waitForNavigation()]);

    const isErrorMessageDisplayed = await page.evaluate(() => {
      const div = document.querySelector(
        'div.alert.alert-danger[role="alert"]'
      );
      return div !== null;
    });

    if (isErrorMessageDisplayed) {
      console.log('Đăng nhập sai, xin vui lòng thử lại');
      return 'login-fail';
    }

    // Đi tới trang chứa lịch
    await Promise.all([
      page.waitForSelector('span.current'),
      page.evaluate(() => {
        const link = document.querySelector('span.current a');
        link.click();
      }),
      page.waitForNavigation(),
    ]);

    const btnSecondarys = await page.$$eval('.btn.btn-secondary', (buttons) =>
      buttons.map((button) => button.textContent)
    );

    const exCalenBtnId = btnSecondarys.findIndex(
      (text) => text === 'Xuất lịch biểu'
    );
    if (exCalenBtnId !== -1) {
      const exCalenBtn = await page.$$('.btn.btn-secondary');
      await Promise.all([
        exCalenBtn[exCalenBtnId].click(),
        page.waitForNavigation(),
      ]);
    } else {
      console.log('Không tìm thấy button Xuất lịch biểu');
    }

    // Chọn radio Tất cả sự kiện
    const radioInputs = await page.$$('input.form-check-input');
    for (const input of radioInputs) {
      const value = await page.evaluate((el) => el.value, input);
      if (value === 'all' || value === 'recentupcoming') {
        await input.click();
      }
    }

    // Click nút Xuất
    const submitInputs = await page.$$eval('.btn.btn-primary', (inputs) =>
      inputs.map((input) => input.value)
    );
    const subInputId = submitInputs.findIndex(
      (text) => text === 'Lấy địa chỉ mạng của lịch'
    );
    if (subInputId !== -1) {
      const subInput = await page.$$('.btn.btn-primary');
      await Promise.all([
        subInput[subInputId].click(),
        page.waitForNavigation(),
      ]);
    }

    const content = await page.evaluate(() => {
      const div = document.querySelector('.generalbox.calendarurl');
      return div.textContent;
    });
    const url = content.substring('URL Lịch: '.length);
    // const success = getTodosFromUrl(url);
    const success = await new Promise((resolve) => {
      getTodosFromUrl(url)
        .then((result) => resolve(result))
        .catch((error) => {
          console.error('Error in getTodosFromUrl:', error);
          resolve(false);
        });
    });
    if (success) {
      return 'success';
    } else return 'fail';
  } catch (error) {
    console.log(error);
    return 'fail';
  } finally {
    await browser.close();
  }
};

const updateTodosFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {responseType: 'stream'});
    await response.data.pipe(fs.createWriteStream(filePath));
    console.log('Đã tải tệp .ics thành công');

    const data = await readFileAsync(filePath, 'utf8');
    const Todos = parseICalData(data);

    // await Todo.deleteMany({type: 'uit'});

    // for (const todo of Todos) {
    //   const deadline = moment(todo.deadline, 'YYYYMMDDTHHmmssZ').format(
    //     'YYYY-MM-DDTHH:mm:ss.SSSZ'
    //   );
    //   await new Todo({
    //     type: 'uit',
    //     task: todo.task,
    //     description: todo.description.toString() || ' ',
    //     category: todo.category,
    //     deadline: deadline,
    //   }).save();
    //   console.log('Lưu thành công');
    // }

    // cách 1
    // for (const todo of Todos) {
    //   const deadline = moment(todo.deadline, 'YYYYMMDDTHHmmssZ').format(
    //     'YYYY-MM-DDTHH:mm:ss.SSSZ'
    //   );

    //   const filter = {
    //     type: 'uit',
    //     task: todo.task,
    //     category: todo.category,
    //   };

    //   const update = {
    //     $set: {
    //       description: todo.description.toString() || ' ',
    //       deadline: deadline,
    //     },
    //     $setOnInsert: {
    //       complete: todo.complete || false,
    //     },
    //   };

    //   const options = {
    //     upsert: true,
    //     new: true,
    //   };

    //   await Todo.findOneAndUpdate(filter, update, options);
    //   console.log('Lưu thành công');
    // }

    // cách 2
    for (const todo of Todos) {
      const deadline = moment(todo.deadline, 'YYYYMMDDTHHmmssZ').format(
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      );

      const filter = {
        type: 'uit',
        task: todo.task,
      };

      const update = {
        type: 'uit',
        task: todo.task,
        description: todo.description.toString() || ' ',
        category: todo.category,
        deadline: deadline,
      };

      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      };

      const updatedTodo = await Todo.findOneAndUpdate(
        filter,
        update,
        options
      ).lean();

      console.log(updatedTodo ? 'Cập nhật thành công' : 'Tạo mới thành công');
    }

    console.log('Tất cả các todo đã được lưu thành công.');
    // xóa file
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
    return false;
  }
};

const updateData = async (link) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins'],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://courses.uit.edu.vn/login/index.php');

    await page.type('#username', link.username);
    await page.type('#password', link.password);
    await Promise.all([page.click('#loginbtn'), page.waitForNavigation()]);

    const isErrorMessageDisplayed = await page.evaluate(() => {
      const div = document.querySelector(
        'div.alert.alert-danger[role="alert"]'
      );
      return div !== null;
    });

    if (isErrorMessageDisplayed) {
      console.log('Đăng nhập sai, xin vui lòng thử lại');
      return 'login-fail';
    }

    // Đi tới trang chứa lịch
    await Promise.all([
      page.waitForSelector('span.current'),
      page.evaluate(() => {
        const link = document.querySelector('span.current a');
        link.click();
      }),
      page.waitForNavigation(),
    ]);

    const btnSecondarys = await page.$$eval('.btn.btn-secondary', (buttons) =>
      buttons.map((button) => button.textContent)
    );

    const exCalenBtnId = btnSecondarys.findIndex(
      (text) => text === 'Xuất lịch biểu'
    );
    if (exCalenBtnId !== -1) {
      const exCalenBtn = await page.$$('.btn.btn-secondary');
      await Promise.all([
        exCalenBtn[exCalenBtnId].click(),
        page.waitForNavigation(),
      ]);
    } else {
      console.log('Không tìm thấy button Xuất lịch biểu');
    }

    // Chọn radio Tất cả sự kiện
    const radioInputs = await page.$$('input.form-check-input');
    for (const input of radioInputs) {
      const value = await page.evaluate((el) => el.value, input);
      if (value === 'all' || value === 'recentupcoming') {
        await input.click();
      }
    }

    // Click nút Xuất
    const submitInputs = await page.$$eval('.btn.btn-primary', (inputs) =>
      inputs.map((input) => input.value)
    );
    const subInputId = submitInputs.findIndex(
      (text) => text === 'Lấy địa chỉ mạng của lịch'
    );
    if (subInputId !== -1) {
      const subInput = await page.$$('.btn.btn-primary');
      await Promise.all([
        subInput[subInputId].click(),
        page.waitForNavigation(),
      ]);
    }

    const content = await page.evaluate(() => {
      const div = document.querySelector('.generalbox.calendarurl');
      return div.textContent;
    });
    const url = content.substring('URL Lịch: '.length);
    // const success = getTodosFromUrl(url);
    const success = await new Promise((resolve) => {
      updateTodosFromUrl(url)
        .then((result) => resolve(result))
        .catch((error) => {
          console.error('Error in getTodosFromUrl:', error);
          resolve(false);
        });
    });
    if (success) {
      return 'success';
    } else return 'fail';
  } catch (error) {
    console.log(error);
    return 'fail';
  } finally {
    await browser.close();
  }
};

exports.postLink = async (req, res) => {
  try {
    const link = req.body;
    const result = await getData(link);
    if (result === 'success') {
      console.log('success');
      await Link.deleteMany({});
      await Link(link).save();

      const type = 'uit';
      await Nofitied.deleteMany({type: type});
      const nofitied = new Nofitied({
        type: type,
        email: link.username + '@gm.uit.edu.vn',
        time: 30, //để mặc định là 30 phút
      });
      await nofitied.save();
    }
    return res.json({
      data: {
        result: result,
      },
    });
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.getLink = async (req, res) => {
  try {
    const links = await Link.findOne();
    console.log(typeof links);
    return res.json({
      data: links,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.deleteLink = async (req, res) => {
  try {
    await Link.deleteMany({});
    res.send({data: 'success'});
  } catch (error) {
    res.send(error);
  }
};

exports.refreshTodos = async (req, res) => {
  try {
    // const link = req.body;
    // console.log(link.username);
    // const result = await getData(link);
    // return res.json({
    //   data: result,
    // });
    const link = req.body;
    const result = await updateData(link);
    // if (result === 'success') {
    //   console.log('success');
    //   await Link.deleteMany({});
    //   await Link(link).save();
    // }
    return res.json({
      data: {
        result: result,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
