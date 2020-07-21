import type YumekoClient from "../classes/Client";
import readdirRecursive from "../util/ReaddirRecursive";
import { Event } from "../interfaces";
import { join } from "path";

export default function EventLoader (client: YumekoClient): void {
    const path = join(__dirname, "../events");
    const files = readdirRecursive(path);
    for (const file of files) {
        const event: Event = new (require(file).default)(client);
        client.addListener(event.listener, event.exec.bind(event) as any);
    }
}