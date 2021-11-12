# raf-perf

[![npm version](https://img.shields.io/npm/v/raf-perf)](https://www.npmjs.com/package/raf-perf)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/raf-perf)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/raf-perf)](https://bundlephobia.com/package/raf-perf)
[![dependencies](https://img.shields.io/librariesio/release/npm/raf-perf)](https://github.com/dmnsgn/raf-perf/blob/main/package.json)
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

## Classes

<dl>
<dt><a href="#RafPerf">RafPerf</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#OptionsPerformances">OptionsPerformances</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="RafPerf"></a>

## RafPerf

**Kind**: global class

- [RafPerf](#RafPerf)
  - [new RafPerf([options])](#new_RafPerf_new)
  - [.start()](#RafPerf+start)
  - [.tick()](#RafPerf+tick)
  - [.stop()](#RafPerf+stop)
  - ["perf"](#RafPerf+event_perf)
  - ["tick"](#RafPerf+event_tick)

<a name="new_RafPerf_new"></a>

### new RafPerf([options])

Creates an instance of RafPerf.

| Param     | Type                             | Default         | Description                                                                                                                                                         |
| --------- | -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [options] | [<code>Options</code>](#Options) | <code>{}</code> | `samplesCount` and `sampleDuration` are used concurrently. Set `sampleDuration` to a _falsy_ value if you only want to sample performances from a number of frames. |

<a name="RafPerf+start"></a>

### rafPerf.start()

Run the `requestAnimationFrame` loop and start checking performances if `options.performances.enabled` is `true`.

**Kind**: instance method of [<code>RafPerf</code>](#RafPerf)  
<a name="RafPerf+tick"></a>

### rafPerf.tick()

The frame loop callback.

**Kind**: instance method of [<code>RafPerf</code>](#RafPerf)  
**Emits**: [<code>perf</code>](#RafPerf+event_perf), [<code>tick</code>](#RafPerf+event_tick)  
<a name="RafPerf+stop"></a>

### rafPerf.stop()

Run `cancelAnimationFrame` if necessary and reset the engine.

**Kind**: instance method of [<code>RafPerf</code>](#RafPerf)  
<a name="RafPerf+event_perf"></a>

### "perf"

Event triggered when performance ratio (`this.frameDuration / averageDeltaTime`) is updated. Understand a ratio of the fps, for instance for a fps value of 24, `ratio < 0.5` means that the averaged `fps < 12` and you should probably do something about it.

**Kind**: event emitted by [<code>RafPerf</code>](#RafPerf)  
<a name="RafPerf+event_tick"></a>

### "tick"

Event triggered on tick, throttled by `options.fps`.

**Kind**: event emitted by [<code>RafPerf</code>](#RafPerf)  
<a name="Options"></a>

## Options : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name           | Type                                                     | Default                                                                 | Description           |
| -------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------- |
| [fps]          | <code>number</code>                                      | <code>60</code>                                                         | Throttle fps.         |
| [performances] | [<code>OptionsPerformances</code>](#OptionsPerformances) | <code>{ enabled: true, samplesCount: 200, sampleDuration: 4000 }</code> | Performances metrics. |

<a name="OptionsPerformances"></a>

## OptionsPerformances : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name             | Type                 | Default            | Description                                  |
| ---------------- | -------------------- | ------------------ | -------------------------------------------- |
| [enabled]        | <code>boolean</code> | <code>false</code> | Evaluate performances.                       |
| [samplesCount]   | <code>number</code>  | <code>200</code>   | Number of samples to evaluate performances.  |
| [sampleDuration] | <code>number</code>  | <code>200</code>   | Duration of sample to evaluate performances. |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/raf-perf/blob/main/LICENSE.md).
