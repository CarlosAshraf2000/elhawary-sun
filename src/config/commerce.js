/**
 * Spark plan (no Cloud Functions): showcase + quote + WhatsApp only.
 * Set VITE_COMMERCE_MODE=full when Blaze + Functions are deployed.
 */
export const COMMERCE_MODE = import.meta.env.VITE_COMMERCE_MODE || "showcase";

export const isShowcaseMode = () => COMMERCE_MODE === "showcase";
