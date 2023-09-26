const { ipcRenderer } = require("electron");
const { SerialPort } = require("serialport");

const sendBtn = document.getElementById("sendBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

const comPortList = document.getElementById("comPortList");
const serialPortDropdownMenu = document.getElementById(
  "serial-port-dropdown-menu"
);

const serialDataInput = document.getElementById("serialdata-input");
const serialSendBtn = document.getElementById("serialSendBtn");
const serialCloseBtn = document.getElementById("serial-port-close-btn");

const dataTerminal = document.getElementById("data-terminal");

let availableSerialPorts = [];
let selectedSerialPort;

let dataTerminalContent = [];

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      dataTerminal.innerHTML = err.message;
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

        dataTerminalPrint('"' + e.path + '" bulundu.');
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
function dataTerminalPrint(newdata) {
  dataTerminalContent.push(newdata + "\r\n");
  dataTerminal.innerHTML = dataTerminalContent;
}

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

//-----------------------------------------------------------------------
serialPortDropdownMenu.addEventListener("click", () => {
  comPortList.innerText = " " + serialPortDropdownMenu.lastChild.innerText;

  const detailedInfo = availableSerialPorts.find(
    ({ path }) => path === serialPortDropdownMenu.lastChild.innerText
  );

  // console.log(detailedInfo);

  document.getElementById("table-device-port-number").innerText =
    detailedInfo.path ? detailedInfo.path : "N/A";
  document.getElementById("table-device-name").innerText =
    detailedInfo.friendlyName ? detailedInfo.friendlyName : "N/A";
  document.getElementById("table-device-manufacturer").innerText =
    detailedInfo.manufacturer ? detailedInfo.manufacturer : "N/A";
  document.getElementById("table-device-serial-number").innerText =
    detailedInfo.serialNumber ? detailedInfo.serialNumber : "N/A";
  document.getElementById("table-device-locationId").innerText =
    detailedInfo.locationId ? detailedInfo.locationId : "N/A";

  selectedSerialPort = new SerialPort({
    path: detailedInfo.path,
    baudRate: 9600,
    autoOpen: false,
  });

  if (selectedSerialPort.isOpen === false) {
    selectedSerialPort.open(() => {
      dataTerminalPrint(detailedInfo.path + " baglanti noktasi acildi...");

      selectedSerialPort.on("data", (data) => {
        dataTerminalPrint("Alinan veri: " + data);
      });

      document.getElementById("serial-port-baudrate").innerText =
        selectedSerialPort.baudRate;

      comPortList.setAttribute("disabled", "");
      serialCloseBtn.removeAttribute("disabled");
      serialSendBtn.removeAttribute("disabled");
    });
  }
});

serialSendBtn.addEventListener("click", () => {
  if (serialDataInput.value.length === 0) return;

  if (selectedSerialPort.isOpen === true) {
    selectedSerialPort.write(serialDataInput.value);

    serialDataInput.value = null;
  }
});

serialCloseBtn.addEventListener("click", () => {
  selectedSerialPort.close((err) => {
    dataTerminalPrint("HATA: " + err);
  });

  serialCloseBtn.setAttribute("disabled", "");
  serialSendBtn.setAttribute("disabled", "");
  comPortList.removeAttribute("disabled");
});
