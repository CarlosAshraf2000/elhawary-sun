import { describe, it, expect } from "vitest";
import { validateCouponData } from "./coupons";

describe("validateCouponData", () => {
    const baseCoupon = {
        active: true,
        code: "SAVE10",
        type: "percent",
        value: 10,
        usedCount: 0,
    };

    it("applies percent discount", () => {
        const result = validateCouponData(baseCoupon, 1000);
        expect(result.valid).toBe(true);
        expect(result.discount).toBe(100);
    });

    it("applies fixed discount capped at subtotal", () => {
        const result = validateCouponData(
            { ...baseCoupon, type: "fixed", value: 500 },
            300
        );
        expect(result.valid).toBe(true);
        expect(result.discount).toBe(300);
    });

    it("rejects expired coupon", () => {
        const result = validateCouponData(
            { ...baseCoupon, expiresAt: new Date("2020-01-01") },
            1000
        );
        expect(result.valid).toBe(false);
    });

    it("rejects when below min order", () => {
        const result = validateCouponData(
            { ...baseCoupon, minOrder: 500 },
            100
        );
        expect(result.valid).toBe(false);
        expect(result.message).toContain("الحد الأدنى");
    });

    it("rejects when max uses reached", () => {
        const result = validateCouponData(
            { ...baseCoupon, maxUses: 5, usedCount: 5 },
            1000
        );
        expect(result.valid).toBe(false);
    });
});
