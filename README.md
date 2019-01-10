# raf-perf [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm version](https://badge.fury.io/js/raf-perf.svg)](https://www.npmjs.com/package/raf-perf)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

RAF loop with an adaptive fps and performance ratio calculated from either a sample count or a sample duration. Typically used when doing intensive graphics computation in canvas.

![](https://raw.githubusercontent.com/dmnsgn/raf-perf/master/screenshot.gif)

## Installation

```bash
npm install raf-perf
```

[![NPM](https://nodei.co/npm/raf-perf.png)](https://nodei.co/npm/raf-perf/)

## Usage

```js
const RafPerf = require("raf-perf");

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const engine = new RafPerf();

engine.on("tick", dt => {
  // Clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw
  // ...
});

engine.on("perf", ratio => {
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

### `const engine = new RafPerf(options)`

| Option                                  | Type     | Default | Description                                 |
| --------------------------------------- | -------- | ------- | ------------------------------------------- |
| **options.fps**                         | number?  | 60      | Throttle fps                                |
| **options.performances.enabled**        | boolean? | true    | Evaluate performances                       |
| **options.performances.samplesCount**   | number?  | 200     | Number of samples to evaluate performances  |
| **options.performances.sampleDuration** | number?  | 4000    | Duration of sample to evaluate performances |

`samplesCount` and `sampleDuration` are used concurrently. Set `sampleDuration` to a _falsy_ value if you only want to sample performances only from a number of frames.

### `engine.start()`

Run the `requestAnimationFrame` loop and start checking performances if `options.performances.enabled` is `true`.

### `engine.stop()`

Run `cancelAnimationFrame` if necessary and reset the engine.

### `engine.on("tick", (dt: number) => void)`

Event triggered on tick, throttled by `options.fps`.

### `engine.on("perf", (ratio: number) => void)`

Event triggered when performance ratio (`this.frameDuration / averageDeltaTime`) is updated. Understand a ratio of the fps, for instance for a fps value of 24, `ratio < 0.5` means that the averaged `fps < 12` and you should probably do something about it.

## License

MIT. See [license file](https://github.com/dmnsgn/raf-perf/blob/master/LICENSE.md).
