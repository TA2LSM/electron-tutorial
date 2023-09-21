const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;
let mainWindow;

// Bootstrap 4.0.0 css file used in main.html

app.on("ready", () => {
  // console.log("App Started...");

  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file",
      slashes: true, // manage slash (/) for windows and linux based OS >> file://electron/main.html
    })
  );

  // ...
});
