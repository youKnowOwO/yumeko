"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function readdirRecursive(directory) {
    const results = [];
    function read(path) {
        const files = fs_1.readdirSync(path);
        for (const file of files) {
            const dir = path_1.join(path, file);
            if (fs_1.statSync(dir).isDirectory())
                read(dir);
            else
                results.push(dir);
        }
    }
    read(directory);
    return results;
}
exports.default = readdirRecursive;
