import { describe, it, expect } from "vitest";
import { convertFromEgp, formatPrice } from "./currency";

describe("currency", () => {
    it("formats EGP", () => {
        expect(formatPrice(1000, { currency: "EGP", locale: "en-US" })).toBe("1,000");
        expect(formatPrice(1000, { currency: "EGP", locale: "ar-EG" })).toMatch(/١٬٠٠٠|1,000/);
    });

    it("converts to USD", () => {
        expect(convertFromEgp(500, "USD")).toBe(10);
        expect(formatPrice(500, { currency: "USD" })).toMatch(/^\$/);
    });
});
