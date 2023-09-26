const { ipcRenderer } = require("electron");
const { SerialPort } = require("serialport");
// const { autoDetect } = require("@serialport/bindings-cpp");

const sendDataToConsoleBtn = document.getElementById("sendDataToConsoleBtn");
const showTodoListBtn = document.getElementById("showTodoListBtn");

const comPortList = document.getElementById("comPortList");
const serialPortDropdownMenu = document.getElementById(
  "serial-port-dropdown-menu"
);
const serialDataInput = document.getElementById("serialdata-input");
const serialSendBtn = document.getElementById("serialSendBtn");
const serialCloseBtn = document.getElementById("serial-port-close-btn");

const clearDataTerminalSendBtn = document.getElementById(
  "clearDataTerminalSendBtn"
);
const dataTerminal = document.getElementById("data-terminal");

// const Binding = autoDetect();
let availableSerialPorts = [];
let selectedSerialPort = null;

//-----------------------------------------------------------------------
async function listSerialPorts() {
  try {
    await SerialPort.list().then((ports, err) => {
      const comPortList = document.getElementById("comPortList");

      if (err) {
        // printTerminalData("HATA: ", err.message);
        console.log("HATA: ", err);
        return;
      } else {
        availableSerialPorts = [...ports];

        if (availableSerialPorts.length !== 0) {
          // sort ports by ascending order of their names
          if (availableSerialPorts.length > 1) {
            availableSerialPorts.sort((first, second) =>
              first.path.localeCompare(second.path)
            );
          }

          makeSerialPortList(availableSerialPorts);
          comPortList.removeAttribute("disabled");
        } else {
          comPortList.setAttribute("disabled", "");
        }
      }
    });
  } catch (err) {
    printTerminalData("Baglanti noktasi listesi alinamadi!" + err);
  }
}

function makeSerialPortList(availableSerialPorts) {
  const ListItem = document.createElement("li");
  const newItem = document.createElement("a");
  newItem.className = "dropdown-item";
  newItem.href = "#";

  let serialPortDropdownMenuItems =
    serialPortDropdownMenu.children.length !== 0
      ? [...serialPortDropdownMenu.children]
      : [];
  let listedSerialPortNames = [];

  if (serialPortDropdownMenuItems.length !== 0) {
    listedSerialPortNames = serialPortDropdownMenuItems.map((el) => {
      return el.innerText;
    });

    // sort by ascending order
    // listedSerialPortNames.sort((first, second) => first.localeCompare(second));
  }

  // NEED TO REMOVE PORT WHEN IT DISCONNECTED !

  availableSerialPorts.map((el, idx) => {
    if (listedSerialPortNames.includes(el.path) === false) {
      newItem.innerText = el.path;

      ListItem.id = idx;
      ListItem.addEventListener("click", () => {
        ipcRenderer.send("serialPort:Selected", ListItem.id);
      });

      ListItem.appendChild(newItem);
      serialPortDropdownMenu.appendChild(ListItem);

      printTerminalData('"' + el.path + '" bulundu.');
    }

    // sort dropdown menu by ascending order
    if (serialPortDropdownMenu.children.length !== 0) {
      Array.from(serialPortDropdownMenu.getElementsByTagName("li"))
        .sort((first, second) =>
          first.innerText.localeCompare(second.innerText)
        )
        .forEach((li) => serialPortDropdownMenu.appendChild(li));
    }
  });
}

function listPorts() {
  if (selectedSerialPort === null) {
    listSerialPorts();
    setTimeout(listPorts, 2000);
  }
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 500);

//-----------------------------------------------------------------------
function printTerminalData(newdata) {
  dataTerminal.value += newdata + "\r\n";
}

clearDataTerminalSendBtn.addEventListener("click", () => {
  dataTerminal.value = null;
});

//-----------------------------------------------------------------------
sendDataToConsoleBtn.addEventListener("click", () => {
  const dataInput = document.querySelector("#data-input");

  ipcRenderer.send("key:sendBtnClicked", dataInput.value);
  dataInput.value = "";
  dataInput.focus();
});

showTodoListBtn.addEventListener("click", () => {
  ipcRenderer.send("key:openTodoListBtn");
});

//-----------------------------------------------------------------------
function printSerialDeviceInfo(detailedInfo) {
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
}

ipcRenderer.on("serialPort:selectedIdx", (err, selectedIdx) => {
  if (selectedIdx > availableSerialPorts.length) return;

  comPortList.innerText = " " + availableSerialPorts[selectedIdx].path;
  const detailedInfo = { ...availableSerialPorts[selectedIdx] };
  // const detailedInfo = availableSerialPorts.find(
  //   ({ path }) =>
  //     path === serialPortDropdownMenu.childNodes[selectedIdx].innerText
  // );

  printSerialDeviceInfo(detailedInfo);

  selectedSerialPort = new SerialPort({
    path: detailedInfo.path,
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
  });

  // PROBLEM: os platform port binding NEEDED!
  // console.log(selectedSerialPort);

  selectedSerialPort.on("error", (err) => {
    printTerminalData("HATA: Erişim engellendi!");
  });

  // selectedSerialPort.on("open", () => {
  //   comPortList.setAttribute("disabled", "");
  //   serialCloseBtn.removeAttribute("disabled");

  //   document.getElementById("serial-port-baudrate").innerText =
  //     selectedSerialPort.settings.baudRate + "bps";
  //   document.getElementById("serial-port-dataBits").innerText =
  //     selectedSerialPort.settings.dataBits;
  //   document.getElementById("serial-port-stopBits").innerText =
  //     selectedSerialPort.settings.stopBits;
  //   document.getElementById("serial-port-parity").innerText =
  //     selectedSerialPort.settings.parity;
  //   document.getElementById("serial-port-info").removeAttribute("hidden");

  //   selectedSerialPort.on("data", (data) => {
  //     printTerminalData("Alinan veri: " + data);
  //   });

  //   printTerminalData("Baglantı noktasi acildi: " + detailedInfo.path);
  //   document.getElementById("serialdata-input").removeAttribute("disabled");
  //   serialSendBtn.removeAttribute("disabled");
  // });

  // console.log(availableSerialPorts);
  // console.log(selectedSerialPort);
  // console.log(selectedSerialPort.isOpen);

  selectedSerialPort.open(() => {
    comPortList.setAttribute("disabled", "");
    serialCloseBtn.removeAttribute("disabled");

    document.getElementById("serial-port-baudrate").innerText =
      selectedSerialPort.settings.baudRate + "bps";
    document.getElementById("serial-port-dataBits").innerText =
      selectedSerialPort.settings.dataBits;
    document.getElementById("serial-port-stopBits").innerText =
      selectedSerialPort.settings.stopBits;
    document.getElementById("serial-port-parity").innerText =
      selectedSerialPort.settings.parity;
    document.getElementById("serial-port-info").removeAttribute("hidden");

    selectedSerialPort.on("data", (data) => {
      printTerminalData("Alinan veri: " + data);
    });

    printTerminalData("Baglantı noktasi acildi: " + detailedInfo.path);
    document.getElementById("serialdata-input").removeAttribute("disabled");
    serialSendBtn.removeAttribute("disabled");
  });
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
    printTerminalData("Baglantı noktasi kapatildi: " + selectedSerialPort.path);

    serialCloseBtn.setAttribute("disabled", "");
    serialSendBtn.setAttribute("disabled", "");
    document.getElementById("serial-port-info").setAttribute("hidden", "");
    document.getElementById("serialdata-input").setAttribute("disabled", "");
    comPortList.removeAttribute("disabled");

    selectedSerialPort = null;
  });
});
