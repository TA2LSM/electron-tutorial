const { ipcRenderer } = require("electron");

checkTodoListEmpty();

ipcRenderer.on("todoList:updated", (err, todoItem) => {
  // console.log(todoItems);

  // select todo container
  const todoContainer = document.querySelector(".todo-container");

  // Create elements under todo container
  const todoRow = document.createElement("div");
  todoRow.className = "row";

  const todoCol = document.createElement("div");
  todoCol.className =
    "p-2 mb-3 text-light bg-dark col-md-8 offset-2 shadow card d-flex flex-row justify-content-center align-items-center";
  todoCol.style = "background-color: #582E48!important";

  const todoP = document.createElement("p");
  todoP.className = "m-0 w-100";
  todoP.innerText = todoItem.text;

  const todoButtonEdit = document.createElement("button");
  todoButtonEdit.className =
    "btn btn-sm btn-outline-warning flex-shrink-1 mr-1";
  todoButtonEdit.innerText = "Düzenle";

  const todoButtonErase = document.createElement("button");
  todoButtonErase.className = "btn btn-sm btn-outline-danger flex-shrink-1";
  todoButtonErase.innerText = "Sil";

  todoButtonErase.addEventListener("click", () => {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      // erase todo item
    }
  });

  todoCol.appendChild(todoP);
  todoCol.appendChild(todoButtonEdit);
  todoCol.appendChild(todoButtonErase);
  todoRow.appendChild(todoCol);
  todoContainer.appendChild(todoRow);

  checkTodoListEmpty();
});

function checkTodoListEmpty() {
  const todoContainer = document.querySelector(".todo-container");
  const nodataContainer = document.querySelector(".nodata-container");

  if (todoContainer.children.length === 0) {
    nodataContainer.style.display = "block";
  } else {
    nodataContainer.style.display = "none";
  }
}
