import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useProductFilters } from "./useProductFilters";

const products = [
    { id: "1", title: "Sanch Inverter", category: "inverters", brand: "Sanch", powerKw: 5, price: 1000 },
    { id: "2", title: "Solar Panel", category: "panels", price: 500 },
    { id: "3", title: "Must Inverter", category: "inverters", brand: "Must", powerKw: 50, price: 8000 },
];

function wrapper(initial = "/products") {
    return ({ children }) => <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>;
}

describe("useProductFilters", () => {
    it("filters by category", () => {
        const { result } = renderHook(() => useProductFilters(products), {
            wrapper: wrapper("/products?category=inverters"),
        });
        expect(result.current.filtered.length).toBe(2);
    });

    it("filters by search query", () => {
        const { result } = renderHook(() => useProductFilters(products), {
            wrapper: wrapper("/products?q=sanch"),
        });
        expect(result.current.filtered.length).toBe(1);
    });

    it("paginates results", () => {
        const { result } = renderHook(() => useProductFilters(products), { wrapper: wrapper() });
        expect(result.current.paginated.length).toBe(3);
        expect(result.current.totalPages).toBe(1);
    });
});
