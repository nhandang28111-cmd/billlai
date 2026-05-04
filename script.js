const $ = id => document.getElementById(id);

const avatars = [
  "assets/avatar/avatar1.png",
  "assets/avatar/avatar2.png",
  "assets/avatar/avatar3.png",
  "assets/avatar/avatar4.png"
];

const backgrounds = ["bg-rocket", "bg-chart"];

function pad(n){
  return String(n).padStart(2, "0");
}

function setNow(){
  const d = new Date();
  $("time").value =
    `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fmt(n, d = 1){
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  });
}

function formatPrice(n){
  if (n >= 1000) {
    return Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  }

  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 6
  });
}

function randomAvatar(){
  $("avatarImg").src = avatars[Math.floor(Math.random() * avatars.length)];
}

function randomBackground(){
  const main = $("mainArea");
  main.classList.remove(...backgrounds);
  main.classList.add(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
}

function randomAll(){
  randomAvatar();
  randomBackground();
  calculate();
}

function calculate(){
  const side = $("side").value;
  const entry = parseFloat($("entry").value) || 0;
  const mark = parseFloat($("markPrice").value) || 0;
  const lev = parseFloat($("lev").value) || 1;
  const capital = parseFloat($("capital").value) || 0;

  let roi = 0;

  if(entry > 0 && mark > 0){
    roi = side === "Long"
      ? ((mark - entry) / entry) * lev * 100
      : ((entry - mark) / entry) * lev * 100;
  }

  const pnl = capital * roi / 100;
  const positive = pnl >= 0;

  $("outName").textContent = $("userName").value || "****717";
  $("outTime").textContent = $("time").value;
  $("outCoin").textContent = ($("coin").value || "BTC-USDT-M") + " Không kỳ hạn";

  $("outSide").textContent = side === "Long" ? "Nhiều" : "Ngắn";
  $("outSide").className = "badge " + (side === "Long" ? "long" : "short");

  $("outLev").textContent = `${lev}X`;

  $("outPnl").innerHTML =
    `${positive ? "+" : ""}${fmt(pnl, 2)} <small>USDT</small>`;
  $("outPnl").className = "pnl " + (positive ? "profit" : "loss");

  $("outRoi").textContent = `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`;
  $("outRoi").className = "roi " + (roi >= 0 ? "profit" : "loss");

  $("outEntry").textContent = formatPrice(entry);
  $("outMark").textContent = formatPrice(mark);

  $("priceText").textContent = side === "Long" ? "Giá đánh dấu" : "Giá đóng TB";

  $("outInvite").textContent = $("invite").value || "64QUJHK3";

  const qrText = $("qrText").value || $("invite").value || "BITTAP";
  $("qr").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=1&data=" +
    encodeURIComponent(qrText);
}

async function download4K(){
  const bill = $("bill");
  bill.classList.add("exporting");

  try{
    const canvas = await html2canvas(bill, {
      scale: 4,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const a = document.createElement("a");
    a.download = "bittap-pnl-mockup-4k.png";
    a.href = canvas.toDataURL("image/png", 1);

    document.body.appendChild(a);
    a.click();
    a.remove();
  }catch(e){
    alert("Không tải được ảnh. Hãy mở bằng Live Server hoặc chạy qua localhost.");
    console.error(e);
  }finally{
    bill.classList.remove("exporting");
  }
}

[
  "coin",
  "side",
  "lev",
  "capital",
  "entry",
  "markPrice",
  "userName",
  "invite",
  "time",
  "qrText"
].forEach(id => {
  $(id).addEventListener("input", calculate);
});

$("nowBtn").addEventListener("click", () => {
  setNow();
  calculate();
});

$("createBtn").addEventListener("click", calculate);

$("avatarBtn").addEventListener("click", () => {
  randomAvatar();
  calculate();
});

$("bgBtn").addEventListener("click", () => {
  randomBackground();
  calculate();
});

$("allBtn").addEventListener("click", randomAll);

$("downloadBtn").addEventListener("click", download4K);

setNow();
randomAll();
