/**
 * @typedef {object} Options
 * @property {number} [fps=60] Throttle fps.
 * @property {OptionsPerformances} [performances={ enabled: true, samplesCount: 200, sampleDuration: 4000 }] Performances metrics.
 */

/**
 * @typedef {object} OptionsPerformances
 * @property {boolean} [enabled=true] Evaluate performances.
 * @property {number} [samplesCount=200] Number of samples to evaluate performances.
 * @property {number} [sampleDuration=4000] Duration of sample to evaluate performances.
 */

class RafPerf {
  /**
   * @type {string}
   */
  static TickEvent = "tick";
  /**
   * @type {string}
   */
  static PerfEvent = "perf";

  static now() {
    return (performance || Date).now();
  }

  static fpsToMs(value) {
    return (1 / value) * 1000;
  }

  /**
   * Creates an instance of RafPerf.
   *
   * @param {Options} [options={}]
   * `samplesCount` and `sampleDuration` are used concurrently. Set `sampleDuration` to a _falsy_ value if you only want to sample performances from a number of frames.
   */
  constructor(options = {}) {
    this.options = Object.assign(
      {
        fps: 60,
        performances: {
          enabled: true,
          samplesCount: 200,
          // If everything runs smoothtly, samplesCount will be used over sampleDuration
          // 1000 ms / 60 fps * 200 samplesCount = 3333 ms
          sampleDuration: 4000,
        },
      },
      options,
    );

    this.events = {};

    this.reset();

    this.tick = this.tick.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  reset() {
    this.isVisible = true;
    this.running = false;
    this.prevTime = null;
    this.startTime = null;

    this.frameDuration = RafPerf.fpsToMs(this.options.fps);

    this.performance = undefined;
    this.perfSamples = [];

    if (this.requestID) cancelAnimationFrame(this.requestID);
  }

  /**
   * Run the `requestAnimationFrame` loop and start checking performances if `options.performances.enabled` is `true`.
   */
  start() {
    // Check if loop is already running
    if (this.running) return;

    // Set running state and initial time
    this.running = true;
    this.prevTime = RafPerf.now();
    this.startTime = this.prevTime;
    this.perfStartTime = this.prevTime;

    // Add visibility listener
    document.addEventListener(
      "visibilitychange",
      this.onVisibilityChange,
      false,
    );

    // Start ticking
    this.requestID = requestAnimationFrame(this.tick);
  }

  /**
   * The frame loop callback.
   *
   * @fires RafPerf.PerfEvent
   * @fires RafPerf.TickEvent
   */
  tick() {
    // Ensure loop is running
    if (!this.running || !this.isVisible) return;

    const { performances } = this.options;

    // Compute delta time since previous time
    const time = RafPerf.now();
    const deltaTime = time - this.prevTime;

    // Compute delta since previous frame
    const frameDeltaTime = time - this.startTime;

    // Check elapsed time is more than desired frame duration
    if (deltaTime > this.frameDuration) {
      if (performances.enabled) {
        // Push delta time for average computation
        this.perfSamples.push(frameDeltaTime);

        // Check if enough time has passed to sample or number of samples collected is enough
        const perfNeedsUpdates =
          (performances.sampleDuration &&
            time - this.perfStartTime > performances.sampleDuration) ||
          this.perfSamples.length > performances.samplesCount;

        if (perfNeedsUpdates) {
          // Check average and update performance ratio
          const averageDeltaTime =
            this.perfSamples.reduce((time, sum) => time + sum) /
            this.perfSamples.length;
          this.performance = this.frameDuration / averageDeltaTime;

          /**
           * Event triggered when performance ratio (`this.frameDuration / averageDeltaTime`) is updated. Understand a ratio of the fps, for instance for a fps value of 24, `ratio < 0.5` means that the averaged `fps < 12` and you should probably do something about it.
           *
           * @event "perf"
           * @type {number} The performance ratio of frame duration against average delta time.
           */
          this.emit(RafPerf.PerfEvent, this.performance);

          // Reset performances variables
          this.perfSamples = [];
          this.perfStartTime = time;
        }
      }

      // Update prev and start time
      // Compensate for gap between delta time and x number of frames
      this.prevTime = time - (deltaTime % this.frameDuration);
      this.startTime = time;

      /**
       * Event triggered on tick, throttled by `options.fps`.
       *
       * @event "tick"
       * @type {number} The delta since previous frame.
       */
      this.emit(RafPerf.TickEvent, frameDeltaTime);
    }

    this.requestID = requestAnimationFrame(this.tick);
  }

  /**
   * Run `cancelAnimationFrame` if necessary and reset the engine.
   */
  stop() {
    document.removeEventListener(
      "visibilitychange",
      this.onVisibilityChange,
      false,
    );

    this.reset();
  }

  /**
   * Add "perf" and "tick" listeners.
   * @param {string} type
   * @param {Function} cb
   * @returns {Function} Call the return value to unsubscribe.
   */
  on(type, cb) {
    this.events[type] ||= new Set();
    this.events[type].add(cb);
    return () => this.events[type]?.delete(cb);
  }

  emit(type, ...args) {
    this.events[type]?.forEach((cb) => cb(...args));
  }

  onVisibilityChange() {
    this.isVisible = !document.hidden;

    if (this.isVisible) {
      this.reset();
      this.start();
    }
  }
}

export default RafPerf;
