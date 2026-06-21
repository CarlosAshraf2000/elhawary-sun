const ALLOWED_PDF_HOSTS = [
    "i.ibb.co",
    "ibb.co",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
];

export function isAllowedPdfUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:") return false;
        return ALLOWED_PDF_HOSTS.some(
            (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
        );
    } catch {
        return false;
    }
}

export function isValidName(name) {
    const trimmed = String(name || "").trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
}

export function isValidPhone(phone) {
    const cleaned = String(phone || "").replace(/[\s-]/g, "");
    return /^(\+20|0)?1[0-9]{9}$/.test(cleaned) || /^[0-9]{10,15}$/.test(cleaned);
}

export function isValidAddress(address) {
    const trimmed = String(address || "").trim();
    return trimmed.length >= 5 && trimmed.length <= 300;
}

export function isValidCity(city) {
    const trimmed = String(city || "").trim();
    return trimmed.length >= 2 && trimmed.length <= 80;
}

export function isValidSystemDescription(text) {
    const trimmed = String(text || "").trim();
    return trimmed.length >= 3 && trimmed.length <= 500;
}

export function isSafeBannerLink(url) {
    if (!url) return false;
    if (url.startsWith("/")) return true;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

export function isExternalLink(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url);
}
