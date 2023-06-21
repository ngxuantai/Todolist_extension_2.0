const Link = require("../model/link");
const Todo = require("../model/todos");
const puppeteer = require("puppeteer");
const axios = require("axios");
const moment = require("moment");
const fs = require('fs');
const { promisify } = require('util');

const filePath = "calendar.ics";
const readFileAsync = promisify(fs.readFile);

function parseICalData(icsData) {
  const lines = icsData.split("\n");

  const Todos = [];
  let currentTodo = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("BEGIN:VEVENT")) {
      currentTodo = {};
    } else if (line.startsWith("END:VEVENT")) {
      Todos.push(currentTodo);
    } else if (line.startsWith("SUMMARY:")) {
      currentTodo.task = line.substring("SUMMARY:".length);
    } else if (line.startsWith("DESCRIPTION:")) {
      let description = line.substring("DESCRIPTION:".length);
      i++;
      while (!lines[i].startsWith("CLASS:")) {
        description += lines[i].trim();
        i++;
      }
      currentTodo.description = formatDescription(description);
    } else if (line.startsWith("CATEGORIES:")) {
      currentTodo.category = line.substring("CATEGORIES:".length);
    } else if (line.startsWith("DTEND:")) {
      currentTodo.deadline = line.substring("DTEND:".length);
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

getTodosFromUrl = async (url) => {
  let Todos = [];
  axios
    .get(url, { responseType: 'stream' })
    .then(response => {
      response.data.pipe(fs.createWriteStream(filePath));
      console.log("Đã tải tệp .ics thành công");
      readFileAsync(filePath, 'utf8')
      .then(data => {
        Todos = parseICalData(data);
        // In danh sách todos
        Todos.forEach(async (todo) => {
          // console.log("Task:", todo.task);
          // console.log("Description:", todo.description);
          // console.log("Category:", todo.category);
          const deadline = moment(todo.deadline, "YYYYMMDDTHHmmssZ").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          // console.log("Deadline:", todo.deadline.trim());
          // console.log("Deadline:", deadline);
          // console.log(typeof todo.deadline);
          // console.log("---");
          try {
            await new Todo({
              type: "uit",
              task: todo.task,
              description: todo.description.toString() || " ",
              category: todo.category,
              deadline: deadline,
            }).save();
          } catch (error) {
            console.log(error);
          }
        });
        return Todos;
      })
      .catch(err => {
        console.error("Đã xảy ra lỗi khi đọc tệp .ics:", err);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const getData = async (link) => {
  // const browser = await puppeteer.launch({
  //   headless: true,
  //   args: ["--disable-web-security", "--disable-features=IsolateOrigins"],
  // });
  // const page = await browser.newPage();

  // try {
  //   await page.goto("https://courses.uit.edu.vn/login/index.php");

  //   await page.type("#username", link.username);
  //   await page.type("#password", link.password);
  //   await page.click("#loginbtn");

  //   await page.waitForNavigation();

  //   const isErrorMessageDisplayed = await page.evaluate(() => {
  //     const div = document.querySelector(
  //       'div.alert.alert-danger[role="alert"]'
  //     );
  //     return div !== null;
  //   });

  //   if (isErrorMessageDisplayed) {
  //     console.log("Đăng nhập sai, xin vui lòng thử lại");
  //     return "fail";
  //   } else {
  //     // Đi tới trang chứa lịch
  //     await page.waitForSelector("span.current");
  //     await page.evaluate(() => {
  //       const link = document.querySelector("span.current a");
  //       link.click();
  //     });
  //     await page.waitForNavigation();
  //     const btnSecondarys = await page.$$eval(
  //       ".btn.btn-secondary",
  //       (btnSecondarys) => {
  //         return btnSecondarys.map((button) => button.textContent);
  //       }
  //     );
  //     const exCalenBtnId = btnSecondarys.findIndex(
  //       (text) => text === "Xuất lịch biểu"
  //     );
  //     if (exCalenBtnId !== -1) {
  //       const exCalenBtn = await page.$$(".btn.btn-secondary");
  //       await exCalenBtn[exCalenBtnId].click();
  //       await page.waitForNavigation();
  //     } else {
  //       console.log("Không tìm thấy button Xuất lịch biểu");
  //     }
  //     // Chọn radio Tất cả sự kiện
  //     const radioInputs = await page.$$("input.form-check-input");
  //     for (const input of radioInputs) {
  //       const value = await page.evaluate((el) => el.value, input);
  //       if (value === "all") {
  //         await input.click();
  //       }
  //       if (value === "recentupcoming") {
  //         await input.click();
  //       }
  //     }
  //     // Click nút Xuất
  //     const submitInputs = await page.$$eval(
  //       ".btn.btn-primary",
  //       (submitInputs) => {
  //         return submitInputs.map((input) => input.value);
  //       }
  //     );
  //     const subInputId = submitInputs.findIndex(
  //       (text) => text === "Lấy địa chỉ mạng của lịch"
  //     );
  //     if (subInputId !== -1) {
  //       const subInput = await page.$$(".btn.btn-primary");
  //       await subInput[subInputId].click();
  //       await page.waitForNavigation();
  //     }
  //     const content = await page.evaluate(() => {
  //       const div = document.querySelector(".generalbox.calendarurl");
  //       return div.textContent;
  //     });
  //     const url = content.substring("URL Lịch: ".length);
  //     getTodosFromUrl(url);
  //     return "success";
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return "fail";
  // } finally {
  //   await browser.close();
  // }
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-web-security", "--disable-features=IsolateOrigins"],
  });
  const page = await browser.newPage();
  
  try {
    await page.goto("https://courses.uit.edu.vn/login/index.php");
  
    await page.type("#username", link.username);
    await page.type("#password", link.password);
    await Promise.all([
      page.click("#loginbtn"),
      page.waitForNavigation()
    ]);
  
    const isErrorMessageDisplayed = await page.evaluate(() => {
      const div = document.querySelector('div.alert.alert-danger[role="alert"]');
      return div !== null;
    });
  
    if (isErrorMessageDisplayed) {
      console.log("Đăng nhập sai, xin vui lòng thử lại");
      return "fail";
    }
  
    // Đi tới trang chứa lịch
    await Promise.all([
      page.waitForSelector("span.current"),
      page.evaluate(() => {
        const link = document.querySelector("span.current a");
        link.click();
      }),
      page.waitForNavigation()
    ]);
  
    const btnSecondarys = await page.$$eval(".btn.btn-secondary", (buttons) =>
      buttons.map((button) => button.textContent)
    );
  
    const exCalenBtnId = btnSecondarys.findIndex((text) => text === "Xuất lịch biểu");
    if (exCalenBtnId !== -1) {
      const exCalenBtn = await page.$$(".btn.btn-secondary");
      await Promise.all([
        exCalenBtn[exCalenBtnId].click(),
        page.waitForNavigation()
      ]);
    } else {
      console.log("Không tìm thấy button Xuất lịch biểu");
    }
  
    // Chọn radio Tất cả sự kiện
    const radioInputs = await page.$$("input.form-check-input");
    for (const input of radioInputs) {
      const value = await page.evaluate((el) => el.value, input);
      if (value === "all" || value === "recentupcoming") {
        await input.click();
      }
    }
  
    // Click nút Xuất
    const submitInputs = await page.$$eval(".btn.btn-primary", (inputs) =>
      inputs.map((input) => input.value)
    );
    const subInputId = submitInputs.findIndex((text) => text === "Lấy địa chỉ mạng của lịch");
    if (subInputId !== -1) {
      const subInput = await page.$$(".btn.btn-primary");
      await Promise.all([
        subInput[subInputId].click(),
        page.waitForNavigation()
      ]);
    }
  
    const content = await page.evaluate(() => {
      const div = document.querySelector(".generalbox.calendarurl");
      return div.textContent;
    });
    const url = content.substring("URL Lịch: ".length);
    getTodosFromUrl(url);
    // console.log(url);
    return "success";
  } catch (error) {
    console.log(error);
    return "fail";
  } finally {
    await browser.close();
  }  
};

exports.postLink = async (req, res) => {
  try {
    const link = req.body;
    const result = await getData(link);
    // if (result === "success") {
    //   await link.save();
    // }
    // res.send({data: result});
    res.send({data});
  } catch (error) {
    res.send(error);
  }
};

exports.getLink = async (req, res) => {
  try {
    const links = await Link.find();
    res.send(links);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteLink = async (req, res) => {
  try {
    await Link.deleteMany({});
    res.send({data: "success"});
  } catch (error) {
    res.send(error);
  }
};
