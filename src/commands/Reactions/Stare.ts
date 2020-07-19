import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Stare extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "stare");
    }
}
