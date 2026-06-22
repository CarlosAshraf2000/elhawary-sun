/**
 * showcase = catalog + quote + WhatsApp inquiries (no cart)
 * full = cart + checkout + coupons (Cloud Functions when deployed; Firestore fallback on Spark)
 */
export const COMMERCE_MODE = import.meta.env.VITE_COMMERCE_MODE || "showcase";

export const isShowcaseMode = () => COMMERCE_MODE === "showcase";
export const isCommerceEnabled = () => !isShowcaseMode();
