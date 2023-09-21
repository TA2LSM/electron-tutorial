// const electron = require("electron");
// const { ipcRenderer } = electron;

const { ipcRenderer } = require("electron");

let dataInput = document.querySelector("#data-input");
let startBtn = document.getElementById("sendBtn");
let newWindowBtn = document.getElementById("newWindowBtn");

sendBtn.addEventListener("click", () => {
  // alert("Start Button clicked!");
  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
});

newWindowBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});
