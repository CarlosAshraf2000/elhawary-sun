import { describe, it, expect } from "vitest";
import { buildWhatsAppMessage } from "../api/orders";

describe("buildWhatsAppMessage", () => {
    it("includes all cart items and total", () => {
        const items = [
            { title: "لوح", price: 1000, quantity: 2 },
            { title: "انفرتر", price: 5000, quantity: 1 },
        ];
        const msg = decodeURIComponent(
            buildWhatsAppMessage(items, { name: "أحمد", phone: "0123", address: "المنيا" }, 7000)
        );

        expect(msg).toContain("لوح");
        expect(msg).toContain("انفرتر");
        expect(msg).toContain("جنيه");
        expect(msg).toContain("أحمد");
    });

    it("includes coupon discount in message", () => {
        const items = [{ title: "لوح", price: 1000, quantity: 1 }];
        const msg = decodeURIComponent(
            buildWhatsAppMessage(
                items,
                { name: "أحمد", phone: "0123", address: "المنيا" },
                900,
                { discount: 100, code: "SAVE10" }
            )
        );
        expect(msg).toContain("SAVE10");
        expect(msg).toContain("خصم");
        expect(msg).toContain("٩٠٠");
    });
});
