import Elysia from "elysia";
import { rollDice } from "../../services/api/roll";

export const roll = new Elysia({ prefix: "/roll" }).get(
	"/:dice",
	({ params: { dice } }) => rollDice(Number(dice)),
	{
		detail: {
			tags: ["Roll"],
			summary: "Roll a dice with the given number of sides",
		},
	},
);
export default roll;
