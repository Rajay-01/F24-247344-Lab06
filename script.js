const find = document.querySelector("#find");
const box = document.querySelector("#item");
const status = document.querySelector("#status");
const cardName = document.querySelector("#card-name");
const cardPrice = document.querySelector("#card-price");
const slip = document.querySelector("#slip");
const foundEl = document.querySelector("#found");
const dearestEl = document.querySelector("#dearest");
const rows = [];

function clearCard() {
  cardName.textContent = "";
  cardPrice.textContent = "";
}

function paintSlip() {
  slip.textContent = "";
  let dearest = 0;
  for (let i = 0; i < rows.length; i++) {
    const tr = document.createElement("tr");
    const cells = [rows[i].item, String(rows[i].price), String(rows[i].times)];
    for (let c = 0; c < cells.length; c++) {
      const td = document.createElement("td");
      td.textContent = cells[c];
      tr.appendChild(td);
    }
    slip.appendChild(tr);
    if (rows[i].price > dearest) dearest = rows[i].price;
  }
  foundEl.textContent = String(rows.length);
  dearestEl.textContent = String(rows.length === 0 ? 0 : dearest);
}

async function findItem() {
  const item = box.value;
  if (item === "") {
    status.textContent = "undefined";
    return;
  }
  status.textContent = "Loading…";
  find.disabled = true;
  try {
    const response = await fetch("/api/price?item=" + encodeURIComponent(item));
    if (!response.ok) {
      status.textContent = item + " is not in the shop";
      clearCard();
      return;
    }
    const data = await response.json();
    cardName.textContent = data.item;
    cardPrice.textContent = String(data.price);
    let row = null;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].item === data.item) row = rows[i];
    }
    if (row === null) rows.push({ item: data.item, price: data.price, times: 1 });
    else {
      row.times = row.times + 1;
      row.price = data.price;
    }
    status.textContent = data.item + ": Rs " + data.price;
    box.value = "";
    paintSlip();
  } catch (err) {
    status.textContent = "The server is not answering";
    clearCard();
  } finally {
    find.disabled = false;
  }
}

if (find !== null) find.addEventListener("click", findItem);
