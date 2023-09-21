const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;
let mainWindow;

// Bootstrap 4.0.0 css file used in main.html

app.on("ready", () => {
  // console.log("App Started...");

  // Getting OS information (win32 -> Windows, darwin -> macOS, ...etc)
  // const os = process.platform;
  // console.log(os);

  // Create app window
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file",
      slashes: true, // manage slash (/) for windows and linux based OS >> file://electron/main.html
    })
  );

  // Generate app menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // ...
});

// In macOS this menu will be different because of macOS' menu structure
const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      {
        label: "Kaydet",
        accelerator: setShortcut("save"),
        role: "save", //pre-defined keyword
      },
      {
        label: "Çıkış",
        accelerator: setShortcut("quit"),
        role: "quit", //pre-defined keyword
      },
    ],
  },
  {
    label: "Ayarlar",
    submenu: [
      {
        label: "Grafik Görünümü",
      },
      {
        label: "Parametre Ayarla",
      },
    ],
  },
  {
    label: "Hakkında",
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

function setShortcut(param) {
  if (param == "save")
    return process.platform == "darwin" ? "Command+S" : "Ctrl+S";
  else if (param == "quit")
    return process.platform == "darwin" ? "Command+Q" : "Ctrl+Q";
}
