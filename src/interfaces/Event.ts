export interface Event {
    readonly listener: string;
    exec: (...args: unknown[]) => unknown;
}