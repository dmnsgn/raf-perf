const EventEmitter = require("events");

class RafPerf extends EventEmitter {
  constructor(options) {
    super();

    this.options = { ...RafPerf.defaultOptions, ...options };

    // Initialise properties
    this.reset();
    this.isVisible = true;

    this.tick = this.tick.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  reset() {
    this.running = false;
    this.prevTime = null;
    this.startTime = null;

    this.frameDuration = RafPerf.fpsToMs(this.options.fps);

    if (this.options.performances.enabled) {
      this.performance = undefined;
      this.perfSamples = [];
    }

    if (this.requestID) cancelAnimationFrame(this.requestID);
  }

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
      false
    );

    // Start ticking
    this.requestID = requestAnimationFrame(this.tick);
  }

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
          this.emit("perf", this.performance);

          // Reset performances variables
          this.perfSamples = [];
          this.perfStartTime = time;
        }
      }

      // Update prev and start time
      // Compensate for gap between delta time and x number of frames
      this.prevTime = time - (deltaTime % this.frameDuration);
      this.startTime = time;

      // Call user callback function with delta time
      this.emit("tick", frameDeltaTime);
    }

    this.requestID = requestAnimationFrame(this.tick);
  }

  stop() {
    document.removeEventListener(
      "visibilitychange",
      this.onVisibilityChange,
      false
    );

    this.reset();
  }

  onVisibilityChange() {
    this.isVisible = !document.hidden;

    if (this.isVisible) {
      this.reset();
      this.start();
    }
  }
}

// Static
RafPerf.defaultOptions = {
  fps: 60,
  performances: {
    enabled: true,
    samplesCount: 200,
    // If everything runs smoothtly, samplesCount will be used over sampleDuration
    // 1000 ms / 60 fps * 200 samplesCount = 3333 ms
    sampleDuration: 4000
  }
};

RafPerf.now = () => {
  return (performance || Date).now();
};

RafPerf.fpsToMs = value => {
  return (1 / value) * 1000;
};

module.exports = RafPerf;
