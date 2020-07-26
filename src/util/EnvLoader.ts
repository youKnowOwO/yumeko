import { readFileSync } from "fs";
import { join } from "path";

function EnvLoader (): {[key: string]: string} {
    const toAdd: {[key: string]: string} = {};
    const path = join(process.cwd(), ".env");
    const file = readFileSync(path, { encoding: "utf8" })
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