const { ipcRenderer } = require("electron");
const { SerialPort } = require("serialport");

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      // document.getElementById("error").textContent = err.message;
      return;
    } else {
      makeSerialPortList(ports);
    }
  });
}

function makeSerialPortList(ports) {
  const serialPortDropdownMenu = document.getElementById(
    "serial-port-dropdown-menu"
  );

  if (ports.length === 0) {
    while (serialPortDropdownMenu.firstChild) {
      serialPortDropdownMenu.removeChild(serialPortDropdownMenu.lastChild);
    }
  } else {
    ports.map((e) => {
      const serialPortDropdownMenuItems = [...serialPortDropdownMenu.children];
      let allItems = [];

      if (serialPortDropdownMenuItems.length !== 0) {
        allItems = serialPortDropdownMenuItems.map((element) => {
          return element.innerText;
        });
      }

      if (allItems.includes(e.path) === false) {
        const item = document.createElement("a");
        item.className = "dropdown-item";
        item.innerText = e.path;

        serialPortDropdownMenu.appendChild(item);

        //-- ADD SORTING HERE!
      }
    });
  }
}

function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 2000);

//-----------------------------------------------------------------------
const sendBtn = document.getElementById("sendBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

sendBtn.addEventListener("click", () => {
  const dataInput = document.querySelector("#data-input");

  // alert("Start Button clicked!");
  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
  dataInput.value = "";
  dataInput.focus();
});

showTodoListBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});
