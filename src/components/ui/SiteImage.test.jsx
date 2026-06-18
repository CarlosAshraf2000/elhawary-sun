import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SiteImage from "./SiteImage";
import { defaultProduct } from "../../data/productDefaults";

describe("SiteImage", () => {
    it("renders with src and alt", () => {
        render(<SiteImage src="https://example.com/a.jpg" alt="منتج تجريبي" variant="card" />);
        const img = screen.getByAltText("منتج تجريبي");
        expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
    });

    it("falls back on error", () => {
        render(<SiteImage src="https://broken.example/x.jpg" alt="صورة" variant="thumb" />);
        const img = screen.getByAltText("صورة");
        fireEvent.error(img);
        expect(img.getAttribute("src")).toBe(defaultProduct);
    });
});
