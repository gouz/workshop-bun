import type { Command } from "commander";
import db from "../utils/db";

export default (program: Command) => {
	program
		.command("rolls")
		.description("Statistics of rolls")
		.option("-u, --user <string>", "user to log", "")
		.action((options) => {
			const user_id =
				(
					db
						.query("SELECT id FROM users WHERE name = $name")
						.get({ name: options.user }) as { id: number }
				)?.id ?? 0;
			const stats = db
				.query(
					`
					SELECT dice, value, COUNT(value) AS count 
					FROM rolls 
					${options.user !== "" ? "WHERE user_id = $user_id" : ""} 
					GROUP BY dice, value`,
				)
				.all({ user_id });
			console.table(stats);
		});
};
