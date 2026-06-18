import { useState } from "react";
import { defaultProduct } from "../../data/productDefaults";

const VARIANT_CLASSES = {
    card: "aspect-[4/3] group-hover:scale-105 product-image-3d",
    hero: "h-full w-full object-cover scale-105 depth-layer-1",
    thumb: "w-16 h-16 rounded-lg",
    banner: "aspect-[21/9] md:aspect-[3/1]",
    project: "aspect-[4/3]",
};

export default function SiteImage({
    src,
    alt = "",
    variant = "card",
    className = "",
    fallback = defaultProduct,
    gradient = false,
    fetchPriority,
    loading = "lazy",
}) {
    const resolved = src || fallback;
    const [brokenSrc, setBrokenSrc] = useState(null);
    const imgSrc = brokenSrc === resolved ? fallback : resolved;

    const handleError = () => {
        if (brokenSrc !== resolved) {
            setBrokenSrc(resolved);
        }
    };

    if (variant === "thumb") {
        return (
            <img
                src={imgSrc}
                alt={alt}
                loading={loading}
                onError={handleError}
                className={`object-cover shrink-0 ${VARIANT_CLASSES.thumb} ${className}`}
            />
        );
    }

    if (variant === "hero") {
        return (
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={imgSrc}
                    alt={alt}
                    fetchPriority={fetchPriority || "high"}
                    loading="eager"
                    onError={handleError}
                    className={`${VARIANT_CLASSES.hero} ${className}`}
                />
            </div>
        );
    }

    const aspectClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.card;

    return (
        <div className={`relative overflow-hidden bg-gray-200 group ${variant === "thumb" ? "" : "w-full"}`}>
            <img
                src={imgSrc}
                alt={alt}
                loading={loading}
                fetchPriority={fetchPriority}
                onError={handleError}
                className={`w-full h-full object-cover transition-transform duration-500 ${aspectClass} ${className}`}
            />
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            )}
        </div>
    );
}
