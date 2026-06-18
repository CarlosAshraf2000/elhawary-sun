import { describe, it, expect } from "vitest";
import { truncateDescription } from "./text";

describe("truncateDescription", () => {
    it("does not add ellipsis for short text", () => {
        expect(truncateDescription("نص قصير")).toBe("نص قصير");
    });

    it("truncates long text with ellipsis", () => {
        const long = "أ".repeat(100);
        const result = truncateDescription(long);
        expect(result.endsWith("...")).toBe(true);
        expect(result.length).toBe(83);
    });

    it("returns empty string for nullish input", () => {
        expect(truncateDescription(null)).toBe("");
        expect(truncateDescription(undefined)).toBe("");
    });
});
