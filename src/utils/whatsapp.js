import { siteContent } from "../data/siteContent";

export function buildProductInquiryMessage(product, quantity = 1, locale = "ar-EG") {
    const price = Number(product.salePrice ?? product.price) || 0;
    const isEn = locale.startsWith("en");

    if (isEn) {
        const priceLine = price > 0 ? `\nPrice: ${price.toLocaleString(locale)} EGP` : "";
        return encodeURIComponent(
            `Product inquiry — Elhawary Sun\n━━━━━━━━━━━━\nProduct: ${product.title}\nQuantity: ${quantity}${priceLine}\n\nI would like details and availability.`
        );
    }

    const priceLine = price > 0
        ? `\nالسعر: ${price.toLocaleString(locale)} ج`
        : "";

    return encodeURIComponent(
        `استفسار عن منتج — الهواري صن\n━━━━━━━━━━━━\nالمنتج: ${product.title}\nالكمية: ${quantity}${priceLine}\n\nأرغب في معرفة التفاصيل والتوفر.`
    );
}

export function openWhatsAppInquiry(product, quantity = 1, locale = "ar-EG") {
    const text = buildProductInquiryMessage(product, quantity, locale);
    openWhatsAppUrl(text);
}

export function buildQuoteWhatsAppMessage({ name, phone, city, system }, locale = "ar-EG") {
    const isEn = locale.startsWith("en");

    if (isEn) {
        return encodeURIComponent(
            `New quote request — Elhawary Sun\n━━━━━━━━━━━━\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nSystem: ${system}`
        );
    }

    return encodeURIComponent(
        `طلب عرض سعر جديد — الهواري صن\n━━━━━━━━━━━━\nالاسم: ${name}\nالهاتف: ${phone}\nالمدينة: ${city}\nالنظام: ${system}`
    );
}

/** @returns {boolean} true if navigation was attempted */
export function openWhatsAppUrl(encodedText) {
    const url = `${siteContent.social.whatsapp}?text=${encodedText}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
        window.location.assign(url);
    }
    return true;
}

export function openQuoteWhatsApp(quote, locale = "ar-EG") {
    const text = buildQuoteWhatsAppMessage(quote, locale);
    return openWhatsAppUrl(text);
}
