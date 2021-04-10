# raf-perf

[![npm version](https://img.shields.io/npm/v/raf-perf)](https://www.npmjs.com/package/raf-perf)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/raf-perf)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/raf-perf)](https://www.npmjs.com/package/raf-perf)
[![dependencies](https://img.shields.io/david/dmnsgn/raf-perf)](https://github.com/dmnsgn/raf-perf/blob/main/package.json)
[![types](https://img.shields.io/npm/types/raf-perf)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/raf-perf)](https://github.com/dmnsgn/raf-perf/blob/main/LICENSE.md)

RAF loop with an adaptive fps and performance ratio calculated from either a sample count or a sample duration. Typically used when doing intensive graphics computation in canvas.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

![](https://raw.githubusercontent.com/dmnsgn/raf-perf/main/screenshot.gif)

## Installation

```bash
npm install raf-perf
```

## Usage

```js
import RafPerf from "raf-perf";
import createCanvasContext from "canvas-context";

const { context, canvas } = createCanvasContext("2d", {
  width: window.innerWidth,
  height: window.innerHeight,
  offscreen: true,
});
document.body.appendChild(canvas);

const engine = new RafPerf();

engine.on("tick", (dt) => {
  // Clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw
  // ...
});

engine.on("perf", (ratio) => {
  if (!ratio) return;

  console.log(`Performance ratio: ${ratio}`);

  if (ratio < 0.9) {
    console.log("Too many draws");
  } else if (ratio >= 0.9 && rectCount < maxRectCount) {
    console.log("Draw more");
  }
});

engine.start();

const destroy = () => {
  if (engine.isRunning) engine.stop();
  engine.removeAllListeners("tick");
  engine.removeAllListeners("perf");
};
```

## API

<!-- api-start -->

Auto-generated API content.

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/raf-perf/blob/main/LICENSE.md).
