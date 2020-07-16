export interface Event {
    readonly listener: string;
    once?: boolean;
    exec(...args: any): unknown;
}