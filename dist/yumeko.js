"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./classes/Client"));
if (process.argv[2] === "dev") {
    require("./util/EnvLoader");
    require("../config.json").debug = true;
}
const client = new Client_1.default();
client.login(process.env.TOKEN);
