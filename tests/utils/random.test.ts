import { describe, it, expect } from "bun:test";
import random from "../../src/utils/random";

describe("random", () => {
	it("should generate a number between min and max (inclusive)", () => {
		const min = 1;
		const max = 10;
		for (let i = 0; i < 100; i++) {
			const result = random(min, max);
			expect(result).toBeGreaterThanOrEqual(min);
			expect(result).toBeLessThanOrEqual(max);
		}
	});

	it("should throw an error if min is greater than max", () => {
		const min = 5;
		const max = 1;
		expect(() => random(min, max)).toThrow("'min' must be less than 'max'");
	});
});
