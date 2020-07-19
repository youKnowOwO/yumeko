import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Surprised extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "surprised");
    }
}
