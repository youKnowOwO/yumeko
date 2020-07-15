import Client from "./classes/Client";
import "./util/EnvLoader";

const client = new Client();

client.login(process.env.TOKEN);