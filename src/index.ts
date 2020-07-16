import YumekoClient from "./classes/Client";
import "./util/EnvLoader";

const client = new YumekoClient();

client.login(process.env.TOKEN);