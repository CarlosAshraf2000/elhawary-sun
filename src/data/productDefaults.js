import solarPanel from "../assets/products/solar-panel.jpg";
import inverter from "../assets/products/inverter.jpg";
import battery from "../assets/products/battery.jpg";
import waterHeater from "../assets/products/water-heater.jpg";
import accessories from "../assets/products/accessories.jpg";
import defaultProduct from "../assets/products/default-product.jpg";

export const CATEGORY_IDS = [
    "panels",
    "batteries",
    "inverters",
    "controllers",
    "lighting",
    "mounts",
    "led",
    "heaters",
    "other",
];

export const PRODUCT_CATEGORIES = [
    { id: "all", labelKey: "categories.all" },
    ...CATEGORY_IDS.map((id) => ({ id, labelKey: `categories.${id}` })),
];

const categoryImages = {
    panels: solarPanel,
    inverters: inverter,
    batteries: battery,
    heaters: waterHeater,
    accessories: accessories,
    controllers: accessories,
    lighting: accessories,
    mounts: accessories,
    led: accessories,
    other: defaultProduct,
};

export function getProductImage(product) {
    if (product?.imageUrl) return product.imageUrl;
    return categoryImages[product?.category] ?? defaultProduct;
}

export function getCategoryLabel(categoryId, t) {
    if (t) return t(`categories.${categoryId}`) || categoryId;
    return categoryId;
}

export function formatPrice(price) {
    return Number(price || 0).toLocaleString("ar-EG");
}

export function isOnSale(product) {
    if (!product) return false;
    const salePrice = Number(product.salePrice);
    const price = Number(product.price);
    if (!salePrice || salePrice >= price) return false;
    if (product.promoEndsAt) {
        const end = product.promoEndsAt?.toDate?.() ?? new Date(product.promoEndsAt);
        if (end < new Date()) return false;
    }
    return true;
}

export function getEffectivePrice(product) {
    if (isOnSale(product)) return Number(product.salePrice);
    return Number(product?.price) || 0;
}

export function formatDiscountBadge(product) {
    if (!isOnSale(product)) return null;
    const price = Number(product.price);
    const salePrice = Number(product.salePrice);
    const pct = Math.round(((price - salePrice) / price) * 100);
    return `-${pct}%`;
}

export function isInStock(product) {
    if (product?.soldOut) return false;
    if (product?.stock != null && product.stock <= 0) return false;
    return true;
}

export function getAvailableStock(product) {
    if (product?.soldOut) return 0;
    if (product?.stock == null) return Infinity;
    return Number(product.stock) || 0;
}

export { defaultProduct };
