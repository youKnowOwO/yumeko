import { performance } from "perf_hooks";

export default class Stopwatch {
    public begin = performance.now();

    public toString(): string {
        const dur = this.duration;
        if (dur >= 1000) return `${(dur / 100).toFixed(2)}s`;
        if (dur >= 1) return `${dur.toFixed(2)}ms`;
        return `${(dur * 1000).toFixed(2)}μs`;
    }

    public get duration(): number {
        return performance.now() - this.begin;
    }
}