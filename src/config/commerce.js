/**
 * showcase = catalog + quote + WhatsApp inquiries (no cart)
 * full = cart + checkout + coupons (default; Firestore fallback on Spark)
 */
export const COMMERCE_MODE = import.meta.env.VITE_COMMERCE_MODE || "full";

export const isShowcaseMode = () => COMMERCE_MODE === "showcase";
export const isCommerceEnabled = () => !isShowcaseMode();
