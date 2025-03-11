import { select } from "@inquirer/prompts";
import db from "../../utils/db";

export default async () => {
	const users = await select({
		message: "Select a user to delete",
		choices: (
			db.query("SELECT * FROM users").all() as { name: string; id: number }[]
		).map((user) => ({
			name: user.name,
			value: user.id,
		})),
	});
	db.query("DELETE FROM users WHERE id = $id").run({ id: users });
	console.log("User deleted successfully!");
};
