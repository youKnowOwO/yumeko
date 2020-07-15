import { readFileSync } from "fs";
import { join } from "path";

function EnvLoader (): void {
    const path = join(process.cwd(), ".env");
    const file = readFileSync(path, { encoding: "utf8" });
    for (const env of file.split("\n")) {
        const [name, value] = env.split("=");
        process.env[name] = value;
    }
}

EnvLoader();