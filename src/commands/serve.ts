import type { Command } from "commander";
import server from "../utils/server";

export default (program: Command) => {
	program
		.command("serve")
		.description("Start the server")
		.option("-p, --port <number>", "port to listen on", "8080")
		.action((options) => {
			server(Number(options.port));
		});
};
