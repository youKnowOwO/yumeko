import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Slap extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "slap");
    }
}
