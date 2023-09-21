const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;
let mainWindow;

app.on("ready", () => {
  // console.log("App Started...");

  mainWindow = new BrowserWindow({});
});
