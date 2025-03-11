import type { Command } from "commander";

export default (program: Command) => {
	program
		.command("serve")
		.description("Start the server")
		.option("-p, --port <number>", "port to listen on", "8020")
		.action((options) => {});
};
