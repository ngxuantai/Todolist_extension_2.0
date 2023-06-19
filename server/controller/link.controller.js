const Link = require("../model/link");
const Todo = require("../model/todos");
const puppeteer = require("puppeteer");

const getData = async (link) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-web-security", "--disable-features=IsolateOrigins"],
  }); // Khởi tạo trình duyệt
  const page = await browser.newPage(); // Tạo trang mới

  // Đi tới trang đăng nhập
  await page.goto("https://courses.uit.edu.vn/login/index.php");

  // Nhập tài khoản và mật khẩu vào form đăng nhập
  await page.type("#username", "20520744");
  await page.type("#password", "1446079619");

  // Click nút đăng nhập
  await page.click("#loginbtn");

  // Chờ trang tải xong và đăng nhập thành công
  await page.waitForNavigation();

  console.log("Đăng nhập thành công!");

  // Đi tới trang chứa lịch
  await page.waitForSelector("span.current");
  await page.evaluate(() => {
    const link = document.querySelector("span.current a");
    link.click();
  });
  await page.waitForNavigation();

  const scrollCount = 3;
  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await page.waitForTimeout(1000); // Đợi một khoảng thời gian trước khi cuộn tiếp (tùy chọn)
  }

  // C1: Lấy danh sách các ô trong lịch nhưng bị timeout
  // // Lấy danh sách các ô trong lịch
  // const calendarCells = await page.$$('.calendar_event_course a');

  // // Lặp qua từng ô và in ra nội dung thẻ "a" nếu có
  // for (const cell of calendarCells) {
  //     const text = await page.evaluate(element => element.innerText, cell);
  //     console.log(text);
  // }

  // C2: Lấy danh sách các ô trong lịch bằng button Xuất lịch biểu
  // Click nút Xuất lịch biểu
  const btnSecondarys = await page.$$eval(
    ".btn.btn-secondary",
    (btnSecondarys) => {
      return btnSecondarys.map((button) => button.textContent);
    }
  );

  const exCalenBtnId = btnSecondarys.findIndex(
    (text) => text === "Xuất lịch biểu"
  );
  if (exCalenBtnId !== -1) {
    const exCalenBtn = await page.$$(".btn.btn-secondary");
    await exCalenBtn[exCalenBtnId].click();
    console.log("Đã click nút Xuất lịch biểu");
    await page.waitForNavigation();
    console.log("Đã chuyển trang");
    await page.screenshot({path: "1.png"});
    // await page.waitForTimeout(60000);
    await page.screenshot({path: "2.png"});
  } else {
    console.log("Không tìm thấy button Xuất lịch biểu");
  }

  // Chọn radio Tất cả sự kiện
  const radioInputs = await page.$$("input.form-check-input");
  for (const input of radioInputs) {
    const value = await page.evaluate((el) => el.value, input);
    if (value === "all") {
      await input.click();
      await page.screenshot({path: "3.png"});
    }
    if (value === "recentupcoming") {
      await input.click();
      await page.screenshot({path: "4.png"});
    }
  }

  // Click nút Xuất
  const submitInputs = await page.$$eval(".btn.btn-primary", (submitInputs) => {
    return submitInputs.map((input) => input.value);
  });

  const subInputId = submitInputs.findIndex(
    (text) => text === "Lấy địa chỉ mạng của lịch"
  );
  if (subInputId !== -1) {
    const subInput = await page.$$(".btn.btn-primary");
    await subInput[subInputId].click();
    console.log("Đã click nút Xuất");
    await page.screenshot({path: "5.png"});
    await page.waitForNavigation();
    // await page.waitForTimeout(100000);
    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitForTimeout(1000); // Đợi một khoảng thời gian trước khi cuộn tiếp (tùy chọn)
    }
    // await page.waitForSelector('.generalbox.calendarurl');
    await page.screenshot({path: "6.png"});
  }

  const content = await page.evaluate(() => {
    const div = document.querySelector(".generalbox.calendarurl");
    return div.textContent;
  });
  const url = content.substring("URL Lịch: ".length);
  console.log(url);

  // Điều hướng đến URL chứa tệp .ics
  await page.goto(url);

  // Intercept the response to save it to a file
  page.on("response", async (response) => {
    const url = response.url();
    if (
      url ===
      "https://courses.uit.edu.vn/calendar/export_execute.php?userid=14076&authtoken=261228f85deb582ef59a5271c2f75039a87154ff&preset_what=all&preset_time=recentupcoming"
    ) {
      const buffer = await response.buffer();
      await require("fs").writeFileSync("calendar.ics", buffer);
      console.log("File saved successfully!");
    }
  });

  await browser.close(); // Đóng trình duyệt
};

exports.postLink = async (req, res) => {
  try {
    const link = await new Link(req.body).save();
    console.log(link);
    await getData(link);
    res.send(link);
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
