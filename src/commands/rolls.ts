import type { Command } from "commander";

export default (program: Command) => {
	program
		.command("rolls")
		.description("Statistics of rolls")
		.option("-u, --user <string>", "user to log", "")
		.action((options) => {});
};
