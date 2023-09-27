const { Chart } = require("chart.js/auto");
const ChartData = require("../assets/data/chartData.json");

// const chartArea = document.getElementById("chart-1").getContext("2d");
const chart1Area = document.getElementById("chart-1");

const chart1 = new Chart(chart1Area, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        data: ChartData.data,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
