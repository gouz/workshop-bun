import type { Command } from "commander";
import db from "../utils/db";
import { plot } from "asciichart";

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
				.all({ user_id }) as { dice: number; value: number; count: number }[];
			const newStats = [...stats].reduce(
				(a, { dice, value, count }) => {
					if (!a[dice]) a[dice] = [];
					if (!a[dice][value]) a[dice][value] = [];
					a[dice][value].push(count);
					return a;
				},
				{} as { [key: number]: number[][] },
			);
			Object.entries(newStats).forEach(([dice, values], _) => {
				console.log(`Dice: ${dice}`);
				values.shift();
				console.log(plot(values.flat(), { height: 20, min: 0 }));
			});
		});
};
