import db from "../../utils/db";

export default () => {
	console.table(db.query("SELECT * FROM users").all());
};
