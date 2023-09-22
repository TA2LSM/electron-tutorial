const { ipcRenderer } = require("electron");

const sendBtn = document.getElementById("sendBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

sendBtn.addEventListener("click", () => {
  const dataInput = document.querySelector("#data-input");

  // alert("Start Button clicked!");
  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
  dataInput.value = "";
});

showTodoListBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});
