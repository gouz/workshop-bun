import Elysia from "elysia";
import { rollDice } from "../../services/api/roll";

export const roll = new Elysia({ prefix: "/roll" }).get(
	"/:dice",
	({ params: { dice } }) => rollDice(Number(dice)),
);
export default roll;
