import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useLocale } from "../../hooks/useLocale";
import {
    getProductImage,
    isOnSale,
    getEffectivePrice,
    isInStock,
    getAvailableStock,
} from "../../data/productDefaults";
import { formatPriceWithUnit } from "../../utils/currency";
import SiteImage from "../ui/SiteImage";

export default function ProductCatalogCard({ product, onAddToCart }) {
    const { addItem } = useCart();
    const { t, lang, currency } = useLocale();
    const [qty, setQty] = useState(1);
    const img = getProductImage(product);
    const onSale = isOnSale(product);
    const effectivePrice = getEffectivePrice(product);
    const inStock = isInStock(product);
    const stock = getAvailableStock(product);
    const maxQty = stock === Infinity ? 99 : stock;

    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!inStock) return;
        if (stock !== Infinity && qty > stock) return;
        addItem(product, qty);
        onAddToCart?.();
        setQty(1);
    };

    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition">
            <Link to={`/product/${product.id}`} className="block p-3 pb-0">
                <h2 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2">{product.title}</h2>
            </Link>
            <Link to={`/product/${product.id}`} className="block px-3 relative">
                <SiteImage src={img} alt={product.title} variant="card" className="!aspect-square" />
                {!inStock && (
                    <span className="absolute bottom-0 inset-x-3 bg-red-600 text-white text-center py-1 text-sm font-bold">
                        {t("shop.soldOut")}
                    </span>
                )}
            </Link>
            <div className="p-3 flex-1 flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-2 border-b border-dashed border-gray-200 pb-2">
                    <span className="text-gray-500">{t("shop.requestPrice")}</span>
                    <span className="font-semibold text-gray-800">
                        {product.requestPrice
                            ? formatPriceWithUnit(product.requestPrice, priceOpts)
                            : t("shop.priceOnRequest")}
                    </span>
                </div>
                <div className="flex justify-between gap-2 border-b border-dashed border-gray-200 pb-2">
                    <span className="text-gray-500">{t("shop.productPrice")}</span>
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
                        className="w-14 border border-dashed border-gray-300 rounded px-2 py-2 text-center"
                        aria-label={t("shop.quantity")}
                    />
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!inStock}
                        className="flex-1 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 px-3 rounded flex items-center justify-center gap-2"
                    >
                        <FaShoppingCart />
                    </button>
                </div>
                {inStock && stock !== Infinity && stock <= 10 && (
                    <p className="text-xs text-amber-700">* {t("shop.stockLeft", { count: stock })}</p>
                )}
            </div>
        </article>
    );
}
