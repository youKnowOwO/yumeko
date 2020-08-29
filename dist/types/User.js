"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TypeUser {
    constructor() {
        this.name = "user";
    }
    exec(msg, content) {
        const memberType = msg.client.collector.runner.argsParser.getType("member");
        return memberType(msg, content).user;
    }
}
exports.default = TypeUser;
