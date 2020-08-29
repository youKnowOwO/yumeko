"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
exports.default = CustomError;
