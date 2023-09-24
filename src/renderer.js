const { ipcRenderer } = require("electron");
const { SerialPort } = require("serialport");

const sendBtn = document.getElementById("sendBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

const comPortList = document.getElementById("comPortList");
const serialPortDropdownMenu = document.getElementById(
  "serial-port-dropdown-menu"
);
const dataTerminal = document.getElementById("data-terminal");

let availableSerialPorts = [];

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      dataTerminal.innerText = err.message;
      return;
    } else {
      availableSerialPorts = [...ports];
      // console.log(availableSerialPorts);
      makeSerialPortList(availableSerialPorts);
    }
  });
}

function makeSerialPortList(ports) {
  const comPortList = document.getElementById("comPortList");

  const ListItem = document.createElement("li");
  const newItem = document.createElement("a");
  newItem.className = "dropdown-item";

  if (ports.length === 0) {
    if (serialPortDropdownMenu.children.length !== 0) {
      while (serialPortDropdownMenu.firstChild) {
        serialPortDropdownMenu.removeChild(serialPortDropdownMenu.lastChild);
      }
    }

    comPortList.setAttribute("disabled", "");
  } else {
    comPortList.removeAttribute("disabled");

    ports.map((e) => {
      const serialPortDropdownMenuItems = [...serialPortDropdownMenu.children];
      let allItems = [];

      if (serialPortDropdownMenuItems.length !== 0) {
        allItems = serialPortDropdownMenuItems.map((element) => {
          return element.innerText;
        });
      }

      if (allItems.includes(e.path) === false) {
        newItem.innerText = e.path;
        ListItem.id = e.path;
        // newItem.addEventListener("click", () => {
        //   ipcRenderer.send("comPortSelected", e.path);
        // });

        ListItem.appendChild(newItem);
        serialPortDropdownMenu.appendChild(ListItem);

        //-- ADD SORTING HERE!

        dataTerminal.innerText = '\r\n"' + e.path + '" bulundu...\r\n'; // ????
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

serialPortDropdownMenu.addEventListener("click", () => {
  comPortList.innerText = " " + serialPortDropdownMenu.lastChild.innerText;

  const detailedInfo = availableSerialPorts.find(
    ({ path }) => path === serialPortDropdownMenu.lastChild.innerText
  );

  document.getElementById("table-device-port-number").innerText =
    detailedInfo.path ? detailedInfo.path : "N/A";
  document.getElementById("table-device-name").innerText =
    detailedInfo.productId ? detailedInfo.productId : "N/A";
  document.getElementById("table-device-manufacturer").innerText =
    detailedInfo.maanufacturer ? detailedInfo.maanufacturer : "N/A";
  document.getElementById("table-device-serial-number").innerText =
    detailedInfo.serialNumber ? detailedInfo.serialNumber : "N/A";
  document.getElementById("table-device-locationId").innerText =
    detailedInfo.serialNumber ? detailedInfo.serialNumber : "N/A";

  // dataTerminal.innerText = "aa";
  // console.log("aaa");
  // console.log(
  //   serialPortDropdownMenu.options[serialPortDropdownMenu.selectedIndex].value
  // );
  // var selText = $(this).text();
  // console.log(selText);
  // $(this)
  //   .parents(".btn-group")
  //   .find(".dropdown-toggle")
  //   .html(selText + ' <span class="caret"></span>');
  // ??????????????????????
  // console.log(serialPortDropdownMenu.lastChild.innerText);
});
