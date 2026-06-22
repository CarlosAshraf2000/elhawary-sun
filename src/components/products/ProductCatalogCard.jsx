import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocale } from "../../hooks/useLocale";
import { useCart } from "../../hooks/useCart";
import { isShowcaseMode } from "../../config/commerce";
import {
    getProductImage,
    isOnSale,
    getEffectivePrice,
    isInStock,
    getAvailableStock,
} from "../../data/productDefaults";
import { formatPriceWithUnit } from "../../utils/currency";
import { openWhatsAppInquiry } from "../../utils/whatsapp";
import SiteImage from "../ui/SiteImage";
import Card3D from "../ui/Card3D";
import GlassPanel from "../ui/GlassPanel";

export default function ProductCatalogCard({ product }) {
    const { t, lang, currency } = useLocale();
    const { addItem } = useCart();
    const commerce = !isShowcaseMode();
    const [qty, setQty] = useState(1);
    const img = getProductImage(product);
    const onSale = isOnSale(product);
    const effectivePrice = getEffectivePrice(product);
    const inStock = isInStock(product);
    const stock = getAvailableStock(product);
    const maxQty = stock === Infinity ? 99 : stock;
    const locale = lang === "en" ? "en-US" : "ar-EG";

    const priceOpts = { currency, locale, t };

    const handleWhatsApp = (e) => {
        e.preventDefault();
        if (!inStock) return;
        openWhatsAppInquiry(product, qty, locale);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!inStock) return;
        addItem({ ...product, price: effectivePrice }, qty);
    };

    return (
        <Card3D intensity={8}>
            <GlassPanel className="overflow-hidden flex flex-col h-full product-image-3d dark:bg-surface/80">
                <Link to={`/product/${product.id}`} className="block p-4 pb-0">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] mb-2">{product.title}</h2>
                </Link>
                <Link to={`/product/${product.id}`} className="block px-4 relative">
                    <SiteImage src={img} alt={product.title} variant="card" className="!aspect-square rounded-card" />
                    {!inStock && (
                        <span className="absolute bottom-2 inset-x-4 bg-red-600 text-white text-center py-1 text-sm font-bold rounded">
                            {t("shop.soldOut")}
                        </span>
                    )}
                </Link>
                <div className="p-4 flex-1 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between gap-2 border-b border-dashed border-gray-200 dark:border-gray-600 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">{t("shop.requestPrice")}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {product.requestPrice
                                ? formatPriceWithUnit(product.requestPrice, priceOpts)
                                : t("shop.priceOnRequest")}
                        </span>
                    </div>
                    <div className="flex justify-between gap-2 border-b border-dashed border-gray-200 dark:border-gray-600 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">{t("shop.productPrice")}</span>
                        <span className="font-bold text-gold">
                            {onSale && (
                                <span className="line-through text-gray-400 text-xs me-1">
                                    {formatPriceWithUnit(product.price, priceOpts)}
                                </span>
                            )}
                            {formatPriceWithUnit(effectivePrice, priceOpts)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                        <input
                            type="number"
                            min={1}
                            max={maxQty}
                            value={qty}
                            disabled={!inStock}
                            onChange={(e) => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
                            className="w-14 border border-gray-300 dark:border-gray-600 dark:bg-surface rounded px-2 py-2 text-center"
                            aria-label={t("shop.quantity")}
                        />
                        {commerce ? (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-3 rounded-btn flex items-center justify-center gap-2 btn-glow"
                                aria-label={t("shop.addToCart")}
                            >
                                <FaShoppingCart />
                                {t("shop.addToCart")}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleWhatsApp}
                                disabled={!inStock}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-btn flex items-center justify-center gap-2 btn-glow"
                                aria-label={t("shop.orderViaWhatsapp")}
                            >
                                <FaWhatsapp />
                                {t("shop.orderViaWhatsapp")}
                            </button>
                        )}
                    </div>
                    {inStock && stock !== Infinity && stock <= 10 && (
                        <p className="text-xs text-amber-700 dark:text-amber-400">* {t("shop.stockLeft", { count: stock })}</p>
                    )}
                </div>
            </GlassPanel>
        </Card3D>
    );
}
