import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Cuddle extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "cuddle");
    }
}
