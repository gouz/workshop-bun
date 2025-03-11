import type { Command } from "commander";

export default (program: Command) => {
	program
		.command("simulate")
		.description("Simulate a batch of rolls")
		.action(() => {});
};
