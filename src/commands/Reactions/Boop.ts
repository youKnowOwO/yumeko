import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Boop extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "boop");
    }
}
