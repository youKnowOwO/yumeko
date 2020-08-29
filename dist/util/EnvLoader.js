"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function EnvLoader() {
    const toAdd = {};
    const path = path_1.join(process.cwd(), ".env");
    const file = fs_1.readFileSync(path, { encoding: "utf8" })
        .replace(/\t/g, "")
        .replace(/\r/g, "");
    for (const env of file.split("\n")) {
        const [name, ...value] = env.split("=");
        toAdd[name] = value.join("=");
    }
    Object.assign(process.env, toAdd);
    return toAdd;
}
EnvLoader();
