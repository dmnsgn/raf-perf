export declare const PerfEventType = "perf";
/** Event triggered when performance ratio (`this.frameDuration / averageDeltaTime`) is updated. Understand a ratio of the fps, for instance for a fps value of 24, `ratio < 0.5` means that the averaged `fps < 12` and you should probably do something about it. */
declare class PerfEvent extends Event {
    /** The performance ratio of frame duration against average delta time. */
    ratio: number;
    constructor();
}
export declare const TickEventType = "tick";
/** Event triggered on tick, throttled by `options.fps`. */
declare class TickEvent extends Event {
    /** The delta since previous frame. */
    timeDelta: number;
    constructor();
}
type RafPerfEvent = PerfEvent | TickEvent;

export type OptionsPerformances = {
    /** Evaluate performances. */
    enabled: boolean;
    /** Number of samples to evaluate performances. */
    samplesCount: number;
    /** Duration of sample to evaluate performances. */
    sampleDuration: number;
};
export type Options = {
    /** Throttle fps. */
    fps: number;
    /** Performances metrics. */
    performances: OptionsPerformances;
};

/** Creates an instance of RafPerf. */
export default class RafPerf extends EventTarget {
    static now: () => number;
    static fpsToMs(value: number): number;
    static PerfEvent: PerfEvent;
    static TickEvent: TickEvent;
    options: Options;
    isVisible?: boolean;
    running?: boolean;
    prevTime?: number | null;
    startTime?: number | null;
    frameDuration?: number;
    performance?: number;
    perfSamples?: number[];
    requestID?: number;
    perfStartTime?: number;
    constructor(options?: Partial<Options>);
    reset(): void;
    /** Run the `requestAnimationFrame` loop and start checking performances if `options.performances.enabled` is `true`. */
    start(): void;
    /** The frame loop callback. Fires {@link PerfEvent} and {@link TickEvent}. */
    tick(): void;
    /** Run `cancelAnimationFrame` if necessary and reset the engine. */
    stop(): void;
    onVisibilityChange(): void;
    dispatchEvent(e: RafPerfEvent): boolean;
    addEventListener<T extends RafPerfEvent['type'], TEvent extends RafPerfEvent & {
        type: T;
    }>(type: T, listener: ((e: TEvent) => void) | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<T extends RafPerfEvent['type'], TEvent extends RafPerfEvent & {
        type: T;
    }>(type: T, listener: ((e: TEvent) => void) | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
}
