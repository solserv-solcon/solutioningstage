const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsvFbwvg5SnFVAoRenv1dvGayWXKZq-RJ2fuhPCofX6ro2MC-BLIwL1_rZ3az9iwSkKtl9_aSSak9g/pub?gid=488974230&single=true&output=csv";

let rawRows = [];
let chartInstance = null;

async function loadData() {
const res = await fetch(CSV_URL);
const text = await res.text();

rawRows = text.trim().split("\n").map(r => r.split(","));

renderTable(rawRows);
renderKPIs(rawRows);
renderChart(rawRows);

document.getElementById("lastUpdated").textContent =
new Date().toLocaleString();
}

function renderTable(rows) {
const table = document.getElementById("data-table");
table.innerHTML = "";

rows.forEach((row, i) => {
const tr = document.createElement("tr");

```
row.forEach(cell => {
  const el = document.createElement(i === 0 ? "th" : "td");
  el.textContent = cell;
  tr.appendChild(el);
});

table.appendChild(tr);
```

});
}

function renderKPIs(rows) {
document.getElementById("totalRows").textContent = rows.length - 1;
}

function renderChart(rows) {
if (rows.length < 2) return;

const headers = rows[0];
const labels = rows.slice(1).map(r => r[0]);
const values = rows.slice(1).map(r => Number(r[1]) || 0);

if (chartInstance) {
chartInstance.destroy();
}

chartInstance = new Chart(document.getElementById("chart"), {
type: "bar",
data: {
labels: labels,
datasets: [{
label: headers[1],
data: values
}]
},
options: {
responsive: true,
plugins: {
legend: { display: true }
}
}
});
}

// 🔍 Search filter
document.addEventListener("input", function (e) {
if (e.target.id !== "searchInput") return;

const value = e.target.value.toLowerCase();

const filtered = rawRows.filter((row, i) => {
if (i === 0) return true;
return row.some(cell => cell.toLowerCase().includes(value));
});

renderTable(filtered);
});

// 🔄 Auto refresh every 60s
setInterval(loadData, 60000);

loadData();
