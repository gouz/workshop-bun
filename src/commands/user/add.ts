import { input } from "@inquirer/prompts";
import { randomUUIDv7 } from "bun";
import db from "../../utils/db";
import chalk from "chalk";

export const checkUserExists = (name: string) =>
	db.query("SELECT * FROM users WHERE name = $name").get({ name }) !== null;

export const createUser = (name: string) => {
	const token = randomUUIDv7();
	db.query("INSERT INTO users (name, token) VALUES ($name, $token)").run({
		name,
		token,
	});
	return token;
};

export default async () => {
	let name = "";
	while (name === "") {
		name = await input({
			message: "Enter your username",
		});
		// check if already present in db
		if (checkUserExists(name)) {
			console.error(chalk.red.bold("Username already exists"));
			name = "";
		}
	}
	const token = createUser(name);
	console.log(`User added successfully! Token: ${chalk.bgGreen.bold(token)}`);
};
