// const electron = require("electron");
// const { ipcRenderer } = electron;

const { ipcRenderer } = require("electron");

// let startBtn = document.querySelector("#startBtn");
let startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  // alert("Start Button clicked!");
  ipcRenderer.send("startBtnBtnClicked", "Yollanan Veri");
});
