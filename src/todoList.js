const { ipcRenderer } = require("electron");

document.querySelector("#quickTodoAddBtn").addEventListener("click", () => {
  const quickTodoInput = document.querySelector("#quickTodoInput");

  if (quickTodoInput.value.length !== 0) {
    ipcRenderer.send("newTodoWindow:save", {
      method: "quickTodo",
      value: quickTodoInput.value,
    });

    quickTodoInput.value = "";
  }
});

// Catching events sended by xxx.webContents.send()
ipcRenderer.on("todoList:updated", (err, data) => {
  createTodo(data);
  checkTodoListEmpty();
});

ipcRenderer.on("todoList:printAll", (err, todoList) => {
  document.querySelector(".nodata-container").style.display = "none";
  todoList.map((item) => createTodo(item));
});

function createTodo(data) {
  // select todo container
  const todoContainer = document.querySelector(".todo-container");

  // Create elements under todo container
  const todoRow = document.createElement("div");
  todoRow.className = "row";
  todoRow.setAttribute("key", data.id);

  const todoCol = document.createElement("div");
  todoCol.className =
    "p-2 mb-3 text-light bg-dark col-md-8 offset-2 shadow card d-flex flex-row justify-content-center align-items-center";
  todoCol.style = "background-color: #582E48!important";

  const todoP = document.createElement("p");
  todoP.className = "m-0 w-100";
  todoP.innerText = data.text;

  const todoButtonEdit = document.createElement("button");
  todoButtonEdit.className =
    "btn btn-sm btn-outline-warning flex-shrink-1 mr-1";
  todoButtonEdit.innerText = "Düzenle";

  const todoButtonErase = document.createElement("button");
  todoButtonErase.className = "btn btn-sm btn-outline-danger flex-shrink-1";
  todoButtonErase.innerText = "Sil";

  todoCol.appendChild(todoP);
  todoCol.appendChild(todoButtonEdit);
  todoCol.appendChild(todoButtonErase);
  todoRow.appendChild(todoCol);
  todoContainer.appendChild(todoRow);

  todoCol.appendChild(todoP);
  todoCol.appendChild(todoButtonEdit);
  todoCol.appendChild(todoButtonErase);
  todoRow.appendChild(todoCol);
  todoContainer.appendChild(todoRow);

  // Add event listener to every single todo item
  todoButtonErase.addEventListener("click", (el) => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      const elIdxToErase = el.target.parentNode.parentNode.getAttribute("key");
      ipcRenderer.send("todoList:EraseItem", elIdxToErase);

      el.target.parentNode.parentNode.remove(); // erase todo item in html file
      checkTodoListEmpty();
    }
  });
}

function checkTodoListEmpty() {
  const todoContainer = document.querySelector(".todo-container");
  const nodataContainer = document.querySelector(".nodata-container");

  if (todoContainer.children.length !== 0) {
    nodataContainer.style.display = "none";
  } else {
    nodataContainer.style.display = "block";
  }
}
