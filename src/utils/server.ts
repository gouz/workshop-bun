import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import layoutHTML from "../view/layout.html" with { type: "text" };
import loginHTML from "../view/pages/login.html" with { type: "text" };
import dashboardHTML from "../view/pages/dashboard.html" with { type: "text" };
import chalk from "chalk";
import db from "./db";
import routes from "../routes";
import packageJSON from "../../package.json";

export default (port: number) => {
	const app = new Elysia()
		.use(
			jwt({
				name: "jwt",
				secret: Bun.env.MYSUPERSECRET ?? "",
			}),
		)
		.use(
			swagger({
				documentation: {
					info: {
						title: "Forge Documentation",
						version: packageJSON.version,
					},
					tags: [
						{ name: "Roll", description: "Roll endpoints" },
						{ name: "User", description: "User endpoints" },
					],
				},
				path: "/v1/swagger",
			}),
		)
		.use(routes)
		.get(
			"/",
			() =>
				new Response(layoutHTML.replace("<main></main>", loginHTML), {
					headers: { "Content-Type": "text/html" },
				}),
		)
		.post(
			"/",
			async ({ jwt, cookie: { auth }, body, error, redirect }) => {
				// check if token exists
				const user = db
					.query("SELECT id, name, token FROM users WHERE token = $token")
					.get({ token: body.token });
				if (user !== null) {
					const value = await jwt.sign({ ...user });
					auth.set({
						value,
						httpOnly: true,
						maxAge: 7 * 86400,
						path: "/dashboard",
					});
					return redirect("/dashboard");
				}
				return error(403, "Invalid token");
			},
			{
				body: t.Object({
					token: t.String(),
				}),
			},
		)
		.get("/dashboard", async ({ jwt, error, cookie: { auth } }) => {
			const profile = await jwt.verify(auth.value);
			if (!profile) return error(401, "Unauthorized");

			return new Response(
				layoutHTML.replace(
					"<main></main>",
					dashboardHTML
						.replaceAll("$$TOKEN$$", profile.token)
						.replaceAll("$$NAME$$", profile.name)
						.replaceAll("$$ID$$", profile.id),
				),
				{ headers: { "Content-Type": "text/html" } },
			);
		})
		.listen(port);
	console.log(
		"Server running on port",
		chalk.cyan(`http://${app.server?.hostname}:${app.server?.port}`),
	);
};
