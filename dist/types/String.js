"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeString {
    constructor() {
        this.name = "string";
    }
    exec(_, content) {
        return content;
    }
}
exports.default = TypeString;
