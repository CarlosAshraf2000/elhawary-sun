import { describe, it, expect } from "vitest";
import { getLocaleParityIssues } from "./index";

describe("i18n parity", () => {
    it("has matching keys in ar and en", () => {
        const { missingInEn, missingInAr } = getLocaleParityIssues();
        expect(missingInEn).toEqual([]);
        expect(missingInAr).toEqual([]);
    });
});
