import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider } from "../context/CartContext";
import { useCart } from "../hooks/useCart";

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const p1 = { id: "1", title: "لوح", price: 1000, imageUrl: "", category: "panels" };
const p2 = { id: "2", title: "انفرتر", price: 5000, imageUrl: "", category: "inverters" };

describe("CartContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("adds multiple products", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(p1, 2);
            result.current.addItem(p2, 1);
        });

        expect(result.current.items).toHaveLength(2);
        expect(result.current.totalItems).toBe(3);
        expect(result.current.totalPrice).toBe(7000);
    });

    it("updates quantity for same product", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(p1, 1);
            result.current.addItem(p1, 2);
        });

        expect(result.current.items[0].quantity).toBe(3);
    });

    it("removes item", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(p1, 1);
            result.current.removeItem("1");
        });

        expect(result.current.items).toHaveLength(0);
    });

    it("does not add out-of-stock product", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const outOfStock = { ...p1, stock: 0 };

        act(() => {
            result.current.addItem(outOfStock, 1);
        });

        expect(result.current.items).toHaveLength(0);
    });

    it("does not exceed available stock", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const limited = { ...p1, stock: 2 };

        act(() => {
            result.current.addItem(limited, 2);
            result.current.addItem(limited, 1);
        });

        expect(result.current.items[0].quantity).toBe(2);
    });

    it("does not update quantity beyond stock", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const limited = { ...p1, stock: 3 };

        act(() => {
            result.current.addItem(limited, 1);
            result.current.updateQty("1", 5);
        });

        expect(result.current.items[0].quantity).toBe(1);
    });
});
