import type { Command } from "commander";
import add from "./user/add";
import { default as remove } from "./user/delete";
import list from "./user/list";

export default (program: Command) => {
	const user = program
		.command("user")
		.description("user management")
		.action(() => {
			console.info("a subcommand is needed here");
			process.exit(1);
		});

	user.command("add").action(add);
	user.command("delete").action(remove);
	user.command("list").action(list);
};
