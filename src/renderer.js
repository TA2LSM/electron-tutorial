// const electron = require("electron");
// const { ipcRenderer } = electron;

const { ipcRenderer } = require("electron");

let dataInput = document.querySelector("#data-input");
let startBtn = document.getElementById("startBtn");
let newWindowBtn = document.getElementById("newWindowBtn");

startBtn.addEventListener("click", () => {
  // alert("Start Button clicked!");
  ipcRenderer.send("key:startBtnBtnClicked", dataInput.value);
});

newWindowBtn.addEventListener("click", () => {
  ipcRenderer.send("key:newWindowBtn");
});
