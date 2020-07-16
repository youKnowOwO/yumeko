import { ArgumentTypeFunction } from "./Command";

export interface Event {
    readonly listener: string;
    once?: boolean;
    exec(...args: any): unknown;
}

export interface Type {
    readonly name: string;
    exec: ArgumentTypeFunction;
}