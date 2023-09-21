const { ipcRenderer } = require("electron");

ipcRenderer.on("todoList:updated", (err, todoItems) => {
  console.log(todoItems);
});
