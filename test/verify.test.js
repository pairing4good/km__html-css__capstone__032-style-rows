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

describe('the tasks-description', () => {
  it('should take 90% of the row', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.task-description.*{[\s\S][^}]*flex.*:.*90%.*;/g).length;
    });
    
    expect(matches).toEqual(1);
  });
});

describe('the tasks-status', () => {
  it('should take 10% of the row', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.task-status.*{[\s\S][^}]*flex.*:.*10%.*;/g).length;
    });
    
    expect(matches).toEqual(1);
  });
});

describe('each row', () => {
  it('should be underlined in gray', async () => {
    const border = await page.$eval('.row', (row) => {
      let style = window.getComputedStyle(row);
      return style.getPropertyValue('border-bottom');
    });
    
    expect(border).toContain('px solid rgb(128, 128, 128)');
  });
});

describe('the task-status', () => {
  it('should be centered within its background color', async () => {
    const textAlign = await page.$eval('.task-status', (taskStatus) => {
      let style = window.getComputedStyle(taskStatus);
      return style.getPropertyValue('text-align');
    });
    
    expect(textAlign).toBe('center');
  });
});

describe('the tasks-status', () => {
  it('should be at least 4em wide but can grow larger', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.task-status.*{[\s\S][^}]*min-width.*:.*4em.*;/g).length;
    });
    
    expect(matches).toEqual(1);
  });
});

describe('the tasks-status', () => {
  it('should be exactly 1em tall', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.task-status.*{[\s\S][^}]*height.*:.*1em.*;/g).length;
    });
    
    expect(matches).toEqual(1);
  });
});
