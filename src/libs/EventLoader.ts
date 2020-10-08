import type YumekoClient from "@yumeko/classes/Client";
import readdirRecursive from "@yumeko/util/ReaddirRecursive";
import { Event } from "@yumeko/interfaces";
import { join } from "path";

export default function EventLoader (client: YumekoClient): void {
    const path = join(__dirname, "../events");
    const files = readdirRecursive(path);
    for (const file of files) {
        const event: Event = new (require(file).default)(client);
        if (event.devOnly && !client.config.dev) continue;
        client.addListener(event.listener, event.exec.bind(event) as any);
    }
}