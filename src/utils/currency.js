const USD_RATE = Number(import.meta.env.VITE_USD_RATE) || 50;

export function convertFromEgp(amountEGP, currency) {
    const n = Number(amountEGP) || 0;
    if (currency === "USD") return n / USD_RATE;
    return n;
}

export function formatPrice(amountEGP, { currency = "EGP", locale = "ar-EG" } = {}) {
    const value = convertFromEgp(amountEGP, currency);
    const loc = currency === "USD" ? "en-US" : locale;
    const formatted = value.toLocaleString(loc, {
        minimumFractionDigits: 0,
        maximumFractionDigits: currency === "USD" ? 2 : 0,
    });
    if (currency === "USD") return `$${formatted}`;
    return `${formatted}`;
}

export function formatPriceWithUnit(amountEGP, options = {}) {
    const { currency = "EGP", locale = "ar-EG", t } = options;
    const amount = formatPrice(amountEGP, { currency, locale });
    if (currency === "USD") return amount;
    const unit = t ? (locale.startsWith("en") ? " EGP" : " ج") : " ج";
    return `${amount}${unit}`;
}

export { USD_RATE };
