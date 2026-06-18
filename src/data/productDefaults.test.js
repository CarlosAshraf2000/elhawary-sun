import { describe, it, expect } from "vitest";
import { getProductImage, PRODUCT_CATEGORIES, getEffectivePrice, isOnSale, formatDiscountBadge, getCategoryLabel } from "./productDefaults";

describe("productDefaults", () => {
    it("returns imageUrl when present", () => {
        expect(getProductImage({ imageUrl: "https://example.com/img.jpg", category: "panels" })).toBe(
            "https://example.com/img.jpg"
        );
    });

    it("returns category fallback when no imageUrl", () => {
        const img = getProductImage({ category: "heaters" });
        expect(img).toBeTruthy();
        expect(typeof img).toBe("string");
    });

    it("has categories including all", () => {
        expect(PRODUCT_CATEGORIES.some((c) => c.id === "all")).toBe(true);
        expect(PRODUCT_CATEGORIES.some((c) => c.id === "panels")).toBe(true);
    });

    it("getCategoryLabel uses t when provided", () => {
        const t = (key) => (key === "categories.panels" ? "ألواح" : key);
        expect(getCategoryLabel("panels", t)).toBe("ألواح");
    });

    it("getEffectivePrice uses sale price when on sale", () => {
        const product = { price: 1000, salePrice: 800 };
        expect(getEffectivePrice(product)).toBe(800);
        expect(isOnSale(product)).toBe(true);
        expect(formatDiscountBadge(product)).toBe("-20%");
    });

    it("getEffectivePrice ignores expired sale", () => {
        const product = {
            price: 1000,
            salePrice: 800,
            promoEndsAt: new Date("2020-01-01"),
        };
        expect(isOnSale(product)).toBe(false);
        expect(getEffectivePrice(product)).toBe(1000);
    });
});
