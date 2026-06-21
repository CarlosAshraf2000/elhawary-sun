import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCallable } = vi.hoisted(() => ({
    mockCallable: vi.fn(),
}));

vi.mock("../firebase", () => ({
    functions: {},
}));

vi.mock("firebase/functions", () => ({
    httpsCallable: () => mockCallable,
}));

import { buildWhatsAppMessage, createCartOrder } from "../api/orders";

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

describe("createCartOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls cloud function and returns success", async () => {
        mockCallable.mockResolvedValueOnce({
            data: { subtotal: 2000, discount: 100, total: 1900 },
        });

        const items = [{ id: "1", title: "لوح", price: 1000, quantity: 2, imageUrl: "" }];
        const result = await createCartOrder(
            items,
            { name: "أحمد", phone: "01234567890", address: "المنيا", notes: "" },
            { code: "SAVE" }
        );

        expect(result.success).toBe(true);
        expect(result.total).toBe(1900);
        expect(mockCallable).toHaveBeenCalledOnce();
    });

    it("returns failure when cloud function fails", async () => {
        mockCallable.mockRejectedValueOnce(new Error("fail"));
        const result = await createCartOrder(
            [{ id: "1", title: "لوح", price: 1000, quantity: 1, imageUrl: "" }],
            { name: "أحمد", phone: "01234567890", address: "المنيا", notes: "" }
        );
        expect(result.success).toBe(false);
    });
});
