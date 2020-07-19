import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Clap extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "clap");
    }
}
