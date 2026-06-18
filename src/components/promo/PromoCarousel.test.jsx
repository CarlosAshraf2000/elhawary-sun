import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "../../context/LocaleContext";
import PromoCarousel from "./PromoCarousel";

vi.mock("../../hooks/usePromotions", () => ({
    useBanners: vi.fn(),
}));

import { useBanners } from "../../hooks/usePromotions";

describe("PromoCarousel", () => {
    it("renders nothing when no banners", () => {
        useBanners.mockReturnValue({ banners: [], loading: false });
        const { container } = render(
            <MemoryRouter>
                <LocaleProvider>
                    <PromoCarousel placement="home_hero" />
                </LocaleProvider>
            </MemoryRouter>
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders active banner title", () => {
        useBanners.mockReturnValue({
            banners: [{ id: "1", title: "عرض الصيف", subtitle: "خصم 20%", linkUrl: "/products" }],
            loading: false,
        });
        render(
            <MemoryRouter>
                <LocaleProvider>
                    <PromoCarousel placement="home_hero" />
                </LocaleProvider>
            </MemoryRouter>
        );
        expect(screen.getByText("عرض الصيف")).toBeInTheDocument();
    });
});
