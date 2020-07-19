import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Nom extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "nom");
    }
}
