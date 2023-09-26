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
let selectedSerialPort = null;

let dataTerminalContent = [];

//-----------------------------------------------------------------------
async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      dataTerminalPrint("HATA:", err.message);
      return;
    } else {
      availableSerialPorts = [...ports];
      makeSerialPortList(availableSerialPorts);
    }
  });
}

function makeSerialPortList(ports) {
  const comPortList = document.getElementById("comPortList");

  const ListItem = document.createElement("li");
  const newItem = document.createElement("a");
  newItem.className = "dropdown-item";
  newItem.href = "#";

  if (ports.length === 0) {
    if (serialPortDropdownMenu.children.length !== 0) {
      while (serialPortDropdownMenu.firstChild) {
        serialPortDropdownMenu.removeChild(serialPortDropdownMenu.lastChild);
      }
    }

    comPortList.setAttribute("disabled", "");
  } else {
    ports.map((e, idx) => {
      const serialPortDropdownMenuItems = [...serialPortDropdownMenu.children];
      let allItems = [];

      if (serialPortDropdownMenuItems.length !== 0) {
        allItems = serialPortDropdownMenuItems.map((element) => {
          return element.innerText;
        });
      }

      if (allItems.includes(e.path) === false) {
        newItem.innerText = e.path;

        ListItem.id = idx;
        ListItem.addEventListener("click", () => {
          ipcRenderer.send("serialPort:Selected", ListItem.id);
        });

        ListItem.appendChild(newItem);
        serialPortDropdownMenu.appendChild(ListItem);

        dataTerminalPrint('"' + e.path + '" bulundu.');

        //-- ADD SORTING HERE! for serialPortDropdownMenuItems
      }
    });

    comPortList.removeAttribute("disabled");
  }
}

function listPorts() {
  if (selectedSerialPort === null) {
    listSerialPorts();
    setTimeout(listPorts, 2000);
  }
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 2000);

//-----------------------------------------------------------------------
function dataTerminalPrint(newdata) {
  dataTerminalContent.push(newdata + "\r\n");
  dataTerminal.innerHTML = dataTerminalContent;
}

//-----------------------------------------------------------------------
sendBtn.addEventListener("click", () => {
  const dataInput = document.querySelector("#data-input");

  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
  dataInput.value = "";
  dataInput.focus();
});

showTodoListBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});

//-----------------------------------------------------------------------

ipcRenderer.on("serialPort:selectedIdx", (err, selectedIdx) => {
  comPortList.innerText =
    " " + serialPortDropdownMenu.childNodes[selectedIdx].innerText;

  const detailedInfo = { ...availableSerialPorts[selectedIdx] };
  // const detailedInfo = availableSerialPorts.find(
  //   ({ path }) =>
  //     path === serialPortDropdownMenu.childNodes[selectedIdx].innerText
  // );

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
    parity: "none",
    stopBits: 1,
    autoOpen: false,
  });

  if (selectedSerialPort.isOpen === false) {
    selectedSerialPort.open(() => {
      dataTerminalPrint("Baglantı noktasi acildi: " + detailedInfo.path);

      selectedSerialPort.on("data", (data) => {
        dataTerminalPrint("Alinan veri: " + data);
      });

      console.log(selectedSerialPort);

      document.getElementById("serial-port-baudrate").innerText =
        selectedSerialPort.port.openOptions.baudRate + "bps";
      document.getElementById("serial-port-dataBits").innerText =
        selectedSerialPort.port.openOptions.dataBits;
      document.getElementById("serial-port-stopBits").innerText =
        selectedSerialPort.port.openOptions.stopBits;
      document.getElementById("serial-port-parity").innerText =
        selectedSerialPort.port.openOptions.parity;
      document.getElementById("serial-port-info").removeAttribute("hidden");

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
  selectedSerialPort.close(() => {
    dataTerminalPrint("Baglantı noktasi kapatildi: " + selectedSerialPort.path);

    selectedSerialPort = null;
    serialCloseBtn.setAttribute("disabled", "");
    serialSendBtn.setAttribute("disabled", "");
    document.getElementById("serial-port-info").setAttribute("hidden", "");
    comPortList.removeAttribute("disabled");
  });
});
