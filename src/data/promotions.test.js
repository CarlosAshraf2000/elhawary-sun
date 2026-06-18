import { describe, it, expect } from "vitest";
import { isBannerActive, filterActiveBanners } from "./promotions";

describe("promotions", () => {
    const now = new Date("2026-06-15");

    it("returns active banner within date range", () => {
        const banner = {
            active: true,
            placement: "home_hero",
            startsAt: new Date("2026-06-01"),
            endsAt: new Date("2026-06-30"),
            priority: 1,
        };
        expect(isBannerActive(banner, now)).toBe(true);
    });

    it("rejects expired banner", () => {
        const banner = {
            active: true,
            endsAt: new Date("2026-06-01"),
        };
        expect(isBannerActive(banner, now)).toBe(false);
    });

    it("filters by placement and sorts by priority", () => {
        const banners = [
            { id: "1", active: true, placement: "home_hero", priority: 1 },
            { id: "2", active: true, placement: "home_hero", priority: 5 },
            { id: "3", active: true, placement: "home_mid", priority: 10 },
        ];
        const result = filterActiveBanners(banners, "home_hero", now);
        expect(result.map((b) => b.id)).toEqual(["2", "1"]);
    });
});
