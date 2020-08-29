"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReaddirRecursive_1 = __importDefault(require("@yumeko/util/ReaddirRecursive"));
const path_1 = require("path");
function EventLoader(client) {
    const path = path_1.join(__dirname, "../events");
    const files = ReaddirRecursive_1.default(path);
    for (const file of files) {
        const event = new (require(file).default)(client);
        client.addListener(event.listener, event.exec.bind(event));
    }
}
exports.default = EventLoader;
