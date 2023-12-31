/**
 * Bootstrap 4.0.0 css file used in this project
 * Bootstrap icons >> https://icons.getbootstrap.com/
 * jQuery v3.7.1 slim. min >> https://releases.jquery.com/
 * Popper v1.16.1 (umd) min >> https://unpkg.com/browse/popper.js@1.16.1/
 * Icons >> https://icon-icons.com, https://iconfinder.com
 * Chart >> https://www.chartjs.org/docs/latest/getting-started/
 * Deployment >> Check ReadMe.md
 */

//----- Back-end Codes -----
const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow, dashboardWindow, todoListWindow, newTodoWindow, aboutWindow;

// temporary list
let todoList = [];

app.on("ready", () => {
  // Getting OS information (win32 -> Windows, darwin -> macOS, ...etc)
  // console.log(process.platform);

  // Create app window
  mainWindow = new BrowserWindow({
    // fullscreen: true,
    // resizable: false,
    width: 800,
    height: 720,
    //--- added to solve require issue in html files --
    webPreferences: {
      nodeIntegration: true, // to allow require
      contextIsolation: false, // allow use with Electron 12+
      preload: path.join(__dirname, "preload.js"),
    },
    //-------------------------------------------------
  });

  if (process.env.NODE_ENV === "production") todoListWindow.setResizable(false);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/main.html"),
      protocol: "file:",
      slashes: true, // manage slash (/) for windows and linux based OS >> file://electron/main.html
    })
  );

  // Generate app menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Catching main window's close event (kill all processes)
  mainWindow.on("close", () => {
    // ADD: clearTimeout() for serial port scanner !!!!!!!!!!!!!!
    app.quit();
  });

  // Catching events coming from main.html sended by ipcRenderer.send()
  ipcMain.on("key:sendBtnClicked", (err, data) => {
    if (data) console.log(data);
    else console.log("No data!");
  });

  ipcMain.on("key:openDashboardBtn", () => {
    createDashboardWindow();
  });

  ipcMain.on("key:openTodoListBtn", () => {
    createTodoWindow();
  });

  // Catching events coming from other html files
  ipcMain.on("newTodoWindow:close", () => {
    newTodoWindow.close(); // close new to do page
    newTodoWindow = null;
  });

  ipcMain.on("newTodoWindow:save", (err, data) => {
    // data.method, data.value
    if (data) {
      let todo = {
        id: todoList.length,
        text: data.value,
      };
      todoList.push(todo);

      if (todoListWindow)
        todoListWindow.webContents.send("todoList:updated", todo);

      if (data.method === "newTodo") {
        newTodoWindow.close();
        newTodoWindow = null;
      }
    }
  });

  ipcMain.on("todoWindow:close", () => {
    todoListWindow.close();
    todoListWindow = null;
  });

  ipcMain.on("todoList:Refresh", () => {
    todoListWindow.webContents.send("todoList:printAll", todoList);
  });

  ipcMain.on("todoList:EraseItem", (err, elIdxToErase) => {
    todoList.splice(elIdxToErase, 1);
    // delete todoList[elIdxToErase];  // lenght remains same after delete ??
  });

  ipcMain.on("serialPort:Selected", (err, selectedIdx) => {
    mainWindow.webContents.send("serialPort:selectedIdx", selectedIdx);
  });
});

// In macOS this menu will be different because of macOS' menu structure
const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      // {
      //   label: "Kaydet",
      //   accelerator: setShortcut("save"),
      //   role: "save", //pre-defined keyword
      // },
      {
        label: "Yeni Ekle",
        accelerator: setMenuShortcut("new"),
        click() {
          createNewTodoWindow();
        },
      },
      {
        label: "Çıkış",
        accelerator: setMenuShortcut("quit"),
        role: "quit", //pre-defined keyword
      },
    ],
  },
  // {
  //   label: "Ayarlar",
  //   submenu: [
  //     {
  //       label: "Grafik Görünümü",
  //     },
  //     {
  //       label: "Parametre Ayarla",
  //     },
  //   ],
  // },
  {
    label: "Hakkında",
    click() {
      createAboutWindow();
    },
  },
];

// macOS modification
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({
    label: app.getName(),
    // role: "TODO",
  });
}

// Dev Tools modification
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    submenu: [
      {
        label: "Aç",
        accelerator: setMenuShortcut("devTools"),
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Yenile",
        role: "reload", //pre-defined keyword
      },
    ],
  });
}

function setMenuShortcut(param) {
  if (param == "save")
    return process.platform == "darwin" ? "Command+S" : "Ctrl+S";
  else if (param == "quit")
    return process.platform == "darwin" ? "Command+Q" : "Ctrl+Q";
  else if (param == "new")
    return process.platform == "darwin" ? "Command+N" : "Ctrl+N";
  else if (param == "devTools")
    return process.platform == "darwin" ? "Command+D" : "Ctrl+D";
}

function createTodoWindow() {
  todoListWindow = new BrowserWindow({
    title: "Yapılacaklar Listesi",
    width: 800,
    height: 720,
    //--- added to solve require issue in html files --
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //-------------------------------------------------
  });

  if (process.env.NODE_ENV === "production") todoListWindow.setResizable(false);

  todoListWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/todoList.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // After window rendered print all todo list
  todoListWindow.webContents.once("dom-ready", () => {
    if (todoList.length !== 0)
      todoListWindow.webContents.send("todoList:printAll", todoList);
  });

  // catch todoListWindow's close event for deleting it from memory
  todoListWindow.on("close", () => {
    todoListWindow = null;
  });
}

function createNewTodoWindow() {
  newTodoWindow = new BrowserWindow({
    title: "Yeni Todo Ekle",
    width: 480,
    height: 183,
    resizable: false,
    frame: false,
    //--- added to solve require issue in html files --
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //-------------------------------------------------
  });

  newTodoWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/newTodo.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // catch newTodoWindow's close event for deleting it from memory
  newTodoWindow.on("close", () => {
    newTodoWindow = null;
  });
}

function createDashboardWindow() {
  dashboardWindow = new BrowserWindow({
    title: "Dashboard",
    width: 800,
    height: 600,
    //--- added to solve require issue in html files --
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //-------------------------------------------------
  });

  if (process.env.NODE_ENV === "production")
    dashboardWindow.setResizable(false);

  dashboardWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/dashboard.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // catch aboutWindow's close event for deleting it from memory
  dashboardWindow.on("close", () => {
    dashboardWindow = null;
  });
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "Hakkında",
    width: 350,
    height: 150,
    resizable: false,
  });

  aboutWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/about.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // catch aboutWindow's close event for deleting it from memory
  aboutWindow.on("close", () => {
    aboutWindow = null;
  });
}
