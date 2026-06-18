export const BANNER_PLACEMENTS = [
    { id: "home_hero", label: "الصفحة الرئيسية — بعد الهيرو" },
    { id: "home_mid", label: "الصفحة الرئيسية — وسط الصفحة" },
    { id: "products_top", label: "صفحة المنتجات — أعلى القائمة" },
];

export function isBannerActive(banner, now = new Date()) {
    if (!banner?.active) return false;
    if (banner.startsAt) {
        const start = banner.startsAt?.toDate?.() ?? new Date(banner.startsAt);
        if (start > now) return false;
    }
    if (banner.endsAt) {
        const end = banner.endsAt?.toDate?.() ?? new Date(banner.endsAt);
        if (end < now) return false;
    }
    return true;
}

export function filterActiveBanners(banners, placement, now = new Date()) {
    return banners
        .filter((b) => b.placement === placement && isBannerActive(b, now))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
