import type { Command } from "commander";

export default (program: Command) => {
	const user = program
		.command("user")
		.description("user management")
		.action(() => {
			console.info("a subcommand is needed here");
			process.exit(1);
		});

	user.command("add").action(() => {});
	user.command("delete").action(() => {});
	user.command("list").action(() => {});
};
