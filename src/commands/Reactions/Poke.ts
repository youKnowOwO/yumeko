import YumekoClient from "../../classes/Client";
import AmazedCommand from "./Amazed";

export default class Poke extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "poke");
    }
}
