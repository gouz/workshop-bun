import { Database } from "bun:sqlite";

const initDB = () => {
	const db = new Database(`${process.cwd()}/forge.db`, {
		create: true,
		strict: true,
	});

	db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE
)
    `);

	return db;
};

const db = initDB();
export default db;
