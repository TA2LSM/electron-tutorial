//----- Back-end Codes -----

// Bootstrap 4.0.0 css file used in main.html
const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow, aboutWindow, todoListWindow, newTodoWindow;

// temporary list
let todoList = [];

app.on("ready", () => {
  // Getting OS information (win32 -> Windows, darwin -> macOS, ...etc)
  // const os = process.platform;
  // console.log(os);

  // Create app window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //--- added to solve require issue in main.html ---
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //-------------------------------------------------
  });

  mainWindow.setResizable(false);

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
    app.quit();
  });

  // Catching events coming from main.html
  ipcMain.on("key:sendBtnClicked", (err, data) => {
    if (data) console.log(data);
    else console.log("No data!");
  });

  ipcMain.on("key:openTodoListBtn", () => {
    createTodoWindow();
  });

  // Catching events coming from newTodo.html
  ipcMain.on("newTodoWindow:close", () => {
    newTodoWindow.close(); // close new to do page
    newTodoWindow = null;
  });

  ipcMain.on("newTodoWindow:save", (err, data) => {
    if (data) {
      let todo = {
        id: todoList.length + 1,
        text: data,
      };

      todoList.push(todo);
      todoListWindow.webContents.send("todoList:updated", todo);

      newTodoWindow.close();
      newTodoWindow = null;
    }
  });

  ipcMain.on("todoListWindow:Reload", () => {
    todoListWindow.webContents.reload();
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
}

function createTodoWindow() {
  todoListWindow = new BrowserWindow({
    title: "Yapılacaklar Listesi",
    // width: 400,
    // height: 300,
    //--- added to solve require issue in xxx.html ---
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    //-------------------------------------------------
  });

  todoListWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "../templates/todoList.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // catch todoListWindow's close event for deleting it from memory
  todoListWindow.on("close", () => {
    todoListWindow = null;
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

function createNewTodoWindow() {
  newTodoWindow = new BrowserWindow({
    title: "Yeni Todo Ekle",
    width: 480,
    height: 183,
    resizable: false,
    frame: false,
    //--- added to solve require issue in xxx.html ---
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
