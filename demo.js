const RafPerf = require("./");

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);

const maxRectCount = 380;
let rectCount = maxRectCount;

const engine = new RafPerf();

engine.on("tick", dt => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < rectCount; i++) {
    context.shadowColor = "darksalmon";
    context.shadowBlur = 30;

    context.fillStyle = "lightsalmon";
    context.fillRect(20 + i * 0.5, 80 + i * 0.5, 200, 100);

    context.shadowBlur = 0;
    context.fillStyle = "salmon";
    context.font = "30px Arial";
    context.fillText(`${rectCount} rect with shadowBlur`, 20, 50);
  }
});

engine.on("perf", ratio => {
  if (!ratio) return;

  console.log(`Performance ratio: ${ratio}`);

  if (ratio < 0.9) {
    console.log("Too many draws");
    rectCount -= 10;
  } else if (ratio >= 0.9 && rectCount < maxRectCount) {
    console.log("Draw more");
    rectCount += 5;
  }
});

engine.start();
