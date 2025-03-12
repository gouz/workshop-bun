import Elysia, { t } from "elysia";
import { getRolls, storeRoll } from "../../services/api/user";

export const user = new Elysia({ prefix: "/user" })
	.post(
		"/:id/rolls",
		({ body, params: { id } }) => {
			storeRoll(Number(id), Number(body.dice), Number(body.value));
			return new Response("Roll stored", { status: 201 });
		},
		{
			body: t.Object({
				dice: t.Number(),
				value: t.Number(),
			}),
		},
	)
	.get("/:id/rolls", ({ params: { id } }) => {
		const rolls = getRolls(Number(id));
		return new Response(JSON.stringify({ rolls }), {
			headers: { "Content-Type": "application/json" },
		});
	});
