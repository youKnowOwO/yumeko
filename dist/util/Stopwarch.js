"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
class Stopwatch {
    constructor() {
        this.begin = perf_hooks_1.performance.now();
    }
    toString() {
        const dur = this.duration;
        if (dur >= 1000)
            return `${(dur / 100).toFixed(2)}s`;
        if (dur >= 1)
            return `${dur.toFixed(2)}ms`;
        return `${(dur * 1000).toFixed(2)}μs`;
    }
    get duration() {
        return perf_hooks_1.performance.now() - this.begin;
    }
}
exports.default = Stopwatch;
