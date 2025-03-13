import type { Command } from "commander";
import db from "../utils/db";
import { plot } from "asciichart";
import { createCanvas } from "canvas";
import terminalImage from "terminal-image";
import { Chart, type ChartConfiguration } from "chart.js/auto";

const getStats = (name: string) => {
	const user_id =
		(
			db.query("SELECT id FROM users WHERE name = $name").get({ name }) as {
				id: number;
			}
		)?.id ?? 0;
	const stats = db
		.query(
			`
					SELECT dice, value, COUNT(value) AS count 
					FROM rolls 
					${name !== "" ? "WHERE user_id = $user_id" : ""} 
					GROUP BY dice, value`,
		)
		.all({ user_id }) as { dice: number; value: number; count: number }[];
	return [...stats].reduce(
		(a, { dice, value, count }) => {
			if (!a[dice]) a[dice] = [];
			if (!a[dice][value]) a[dice][value] = [];
			a[dice][value].push(count);
			return a;
		},
		{} as { [key: number]: number[][] },
	);
};

export default (program: Command) => {
	program
		.command("rolls")
		.description("Statistics of rolls")
		.option("-u, --user <string>", "user to log", "")
		.option(
			"-r, --render <type>",
			"render the stats as a plot (ascii or image)",
			"ascii",
		)
		.action(async (options) => {
			const stats = getStats(options.user);
			if (options.render === "ascii") {
				Object.entries(stats).forEach(([dice, values], _) => {
					console.log(`Dice: ${dice}`);
					values.shift();
					console.log(plot(values.flat(), { height: 20, min: 0 }));
				});
			}
			if (options.render === "image") {
				for await (const [dice, values] of Object.entries(stats)) {
					values.shift();
					const canvas = createCanvas(600, 600);
					const ctx = canvas.getContext(
						"2d",
					) as unknown as CanvasRenderingContext2D;
					const chartConfig: ChartConfiguration = {
						type: "bar",
						data: {
							labels: values.map((_, i) => String(i)),
							datasets: [
								{
									label: `Dice: ${dice}`,
									data: values.flat(),
								},
							],
						},
						options: {
							responsive: false,
							maintainAspectRatio: false,
						},
					};
					new Chart(ctx, chartConfig);
					console.log(await terminalImage.buffer(canvas.toBuffer("image/png")));
				}
			}
		});
};
