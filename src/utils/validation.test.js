import { describe, it, expect } from "vitest";
import {
    isAllowedPdfUrl,
    isValidName,
    isValidPhone,
    isSafeBannerLink,
    isExternalLink,
} from "./validation";

describe("validation utils", () => {
    it("allows trusted PDF hosts", () => {
        expect(isAllowedPdfUrl("https://i.ibb.co/abc/file.pdf")).toBe(true);
        expect(isAllowedPdfUrl("http://evil.com/file.pdf")).toBe(false);
    });

    it("validates names and phones", () => {
        expect(isValidName("أ")).toBe(false);
        expect(isValidName("أحمد")).toBe(true);
        expect(isValidPhone("01012345678")).toBe(true);
        expect(isValidPhone("123")).toBe(false);
    });

    it("detects safe banner links", () => {
        expect(isSafeBannerLink("/products")).toBe(true);
        expect(isSafeBannerLink("https://example.com")).toBe(true);
        expect(isExternalLink("https://example.com")).toBe(true);
        expect(isExternalLink("/about")).toBe(false);
    });
});
