import { randomBytes } from "node:crypto";
export default (min: number, max: number) => {
	if (min > max) throw new Error("'min' must be less than 'max'");
	const buffer = randomBytes(
		Math.floor((max - min + 1) / Number.MAX_SAFE_INTEGER) + 1,
	);
	let result = min;
	for (const buf of buffer) {
		result += buf;
	}
	return (result % (max - min + 1)) + min;
};
