import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Cry extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "cry");
    }
}
