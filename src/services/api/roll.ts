import random from "../../utils/random";

export const rollDice = (numdice: number) => {
	const allowed = [4, 6, 8, 10, 12, 20, 100];
	if (!allowed.includes(numdice)) throw new Error("Invalid dice type");
	return random(1, numdice);
};
