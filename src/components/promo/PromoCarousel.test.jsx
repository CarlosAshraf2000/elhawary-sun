import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "../../context/LocaleContext";
import PromoCarousel from "./PromoCarousel";

vi.mock("../../hooks/usePromotions", () => ({
    useBanners: vi.fn(),
}));

import { useBanners } from "../../hooks/usePromotions";

function renderCarousel(placement = "home_hero") {
    return render(
        <MemoryRouter>
            <LocaleProvider>
                <PromoCarousel placement={placement} />
            </LocaleProvider>
        </MemoryRouter>
    );
}

describe("PromoCarousel", () => {
    it("renders nothing when no banners", () => {
        useBanners.mockReturnValue({ banners: [], loading: false });
        const { container } = renderCarousel();
        expect(container.firstChild).toBeNull();
    });

    it("renders active banner title and subtitle", () => {
        useBanners.mockReturnValue({
            banners: [{ id: "1", title: "عرض الصيف", subtitle: "خصم 20%", linkUrl: "/products" }],
            loading: false,
        });
        renderCarousel();
        expect(screen.getByText("عرض الصيف")).toBeInTheDocument();
        expect(screen.getByText("خصم 20%")).toBeInTheDocument();
    });

    it("links entire banner to WhatsApp when link is whatsapp", () => {
        useBanners.mockReturnValue({
            banners: [{ id: "1", title: "عرض", subtitle: "", linkUrl: "whatsapp" }],
            loading: false,
        });
        renderCarousel();
        const link = screen.getByRole("link", { name: /عرض/i });
        expect(link).toHaveAttribute("href", "https://wa.me/201001993667");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders internal link for relative paths", () => {
        useBanners.mockReturnValue({
            banners: [{ id: "1", title: "عرض", linkUrl: "/quote" }],
            loading: false,
        });
        renderCarousel();
        const link = screen.getByRole("link", { name: /عرض/i });
        expect(link).toHaveAttribute("href", "/quote");
    });
});
