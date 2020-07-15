import { Event } from "../interfaces";
import Client from "./Client";
import readdirRecursive from "../util/ReaddirRecursive";
import { join } from "path";

export function EventLoader (client: Client): void {
    const path = join(__dirname, "../events");
    const files = readdirRecursive(path);
    for(const file of files) {
        const event: Event = new (require(file).default)();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error-next-line 2345
        client[event.once ? "once" : "on"](event.listener, event.exec);
    }
}