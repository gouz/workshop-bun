import { input } from "@inquirer/prompts";
import { randomUUIDv7 } from "bun";
import db from "../../utils/db";
import chalk from "chalk";

export default async () => {
	let name = "";
	while (name === "") {
		name = await input({
			message: "Enter your username",
		});
		// check if already present in db
		const user = db
			.query("SELECT * FROM users WHERE name = $name")
			.get({ name });
		if (user) {
			console.error(chalk.red.bold("Username already exists"));
			name = "";
		}
	}
	const token = randomUUIDv7();
	db.query("INSERT INTO users (name, token) VALUES ($name, $token)").run({
		name,
		token,
	});
	console.log(`User added successfully! Token: ${chalk.bgGreen.bold(token)}`);
};
