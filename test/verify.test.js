const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the tasks-status todo', () => {
  it('should have a background of red', async () => {
    const backgroundColor = await page.$eval('.todo', (todo) => {
      let style = window.getComputedStyle(todo);
      return style.getPropertyValue('background-color');
    });
      
    expect(backgroundColor).toBe('rgb(255, 0, 0)');
  });
});

describe('the tasks-status doing', () => {
  it('should have a background of yellow', async () => {
    const backgroundColor = await page.$eval('.doing', (doing) => {
      let style = window.getComputedStyle(doing);
      return style.getPropertyValue('background-color');
    });
    
    expect(backgroundColor).toBe('rgb(255, 255, 0)');
  });
});

describe('the tasks-status done', () => {
  it('should have a background of green', async () => {
    const backgroundColor = await page.$eval('.done', (done) => {
      let style = window.getComputedStyle(done);
      return style.getPropertyValue('background-color');
    });
    
    expect(backgroundColor).toBe('rgb(0, 128, 0)');
  });
});

describe('all of the tasks-status', () => {
  it('should have rounded corners of 10px', async () => {
    const borderRadius = await page.$eval('.task-status', (status) => {
      let style = window.getComputedStyle(status);
      return style.getPropertyValue('border-radius');
    });

    expect(borderRadius).toBe('10px');
  });
});
