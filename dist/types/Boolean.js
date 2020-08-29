"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeBoolean {
    constructor() {
        this.name = "boolean";
    }
    exec(_, content) {
        return !!content.length;
    }
}
exports.default = TypeBoolean;
