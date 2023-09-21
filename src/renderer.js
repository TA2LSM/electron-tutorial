const { ipcRenderer } = require("electron");

const dataInput = document.querySelector("#data-input");
const sendBtn = document.getElementById("sendBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

sendBtn.addEventListener("click", () => {
  // alert("Start Button clicked!");
  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
});

showTodoListBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});
