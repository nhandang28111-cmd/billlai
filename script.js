const $ = id => document.getElementById(id);

const avatars = [
  "assets/avatar/avatar1.png",
  "assets/avatar/avatar2.png",
  "assets/avatar/avatar3.png",
  "assets/avatar/avatar4.png"
];

function pad(n){ return String(n).padStart(2,"0"); }

function setNow(){
  const d = new Date();
  $("time").value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fmt(n, d=1){
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits:d,
    maximumFractionDigits:d
  });
}

function randomAvatar(){
  $("avatarImg").src = avatars[Math.floor(Math.random() * avatars.length)];
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

  $("outName").textContent = $("userName").value || "****675";
  $("outTime").textContent = $("time").value;
  $("outCoin").textContent = ($("coin").value || "BTC-USDT-M") + " Không kỳ hạn";
  $("outSide").textContent = side === "Long" ? "Nhiều" : "Ngắn";
  $("outSide").className = "badge " + (side === "Long" ? "long" : "short");
  $("outLev").textContent = `${lev}X`;

  $("outPnl").innerHTML = `${positive ? "+" : ""}${fmt(pnl, 2)} <small>USDT</small>`;
  $("outPnl").className = "pnl " + (positive ? "profit" : "loss");

  $("outRoi").textContent = `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`;
  $("outRoi").className = "roi " + (roi >= 0 ? "profit" : "loss");

  $("outEntry").textContent = fmt(entry, 1);
  $("outMark").textContent = fmt(mark, 1);
  $("priceText").textContent = side === "Long" ? "Giá đánh dấu" : "Giá đóng TB";
  $("outInvite").textContent = $("invite").value || "QTNMZZFP";

  const qrText = $("qrText").value || $("invite").value || "BITTAP";
  $("qr").src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=1&data=" + encodeURIComponent(qrText);
}

async function download4K(){
  const bill = $("bill");
  bill.classList.add("exporting");

  const canvas = await html2canvas(bill, {
    scale: 4,
    backgroundColor: null,
    useCORS: true,
    logging: false
  });

  bill.classList.remove("exporting");

  const a = document.createElement("a");
  a.download = "bittap-pnl-mockup-4k.png";
  a.href = canvas.toDataURL("image/png", 1);
  a.click();
}

["coin","side","lev","capital","entry","markPrice","userName","invite","time","qrText"]
  .forEach(id => $(id).addEventListener("input", calculate));

$("nowBtn").addEventListener("click", () => { setNow(); calculate(); });
$("createBtn").addEventListener("click", calculate);
$("avatarBtn").addEventListener("click", () => { randomAvatar(); calculate(); });
$("downloadBtn").addEventListener("click", download4K);

setNow();
randomAvatar();
calculate();
