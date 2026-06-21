import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { getProductImage } from "../../data/productDefaults";
import { formatPriceWithUnit } from "../../utils/currency";
import { useLocale } from "../../hooks/useLocale";
import SiteImage from "../ui/SiteImage";

export default function CartItem({ item, compact = false }) {
    const { updateQty, removeItem } = useCart();
    const { t, currency, lang } = useLocale();
    const img = getProductImage(item);
    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    return (
        <div className={`flex gap-4 items-center ${compact ? "py-3" : "py-4 border-b border-gray-100"}`}>
            <SiteImage src={img} alt={item.title} variant="thumb" />
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{item.title}</h3>
                <p className="text-gold font-semibold text-sm">
                    {item.originalPrice && item.originalPrice > item.price ? (
                        <>
                            <span className="line-through text-gray-400 text-xs ml-1">
                                {formatPriceWithUnit(item.originalPrice, priceOpts)}
                            </span>{" "}
                            {formatPriceWithUnit(item.price, priceOpts)}
                        </>
                    ) : (
                        formatPriceWithUnit(item.price, priceOpts)
                    )}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center hover:bg-gold/20" aria-label={t("shop.decreaseQty")}>
                        <FaMinus className="text-xs" />
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center hover:bg-gold/20" aria-label={t("shop.increaseQty")}>
                        <FaPlus className="text-xs" />
                    </button>
                </div>
            </div>
            <div className="text-end">
                <p className="font-bold text-sm">{formatPriceWithUnit(item.price * item.quantity, priceOpts)}</p>
                <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 mt-2 hover:text-red-700" aria-label={t("cart.remove")}>
                    <FaTrash className="text-sm" />
                </button>
            </div>
        </div>
    );
}

export function CartSummary({ showCheckoutLink = true, onCheckout }) {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const { t, currency, lang } = useLocale();
    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    if (items.length === 0) return null;

    return (
        <div className="glass-summary rounded-card p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">{t("cart.summary")}</h3>
            <div className="space-y-2 text-gray-700 mb-4">
                <div className="flex justify-between">
                    <span>{t("cart.piecesCount")}</span>
                    <span className="font-bold">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t("cart.productsCount")}</span>
                    <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gold border-t pt-3 mt-3">
                    <span>{t("cart.total")}</span>
                    <span>{formatPriceWithUnit(totalPrice, priceOpts)}</span>
                </div>
            </div>
            {showCheckoutLink ? (
                <Link to="/checkout" onClick={onCheckout} className="block w-full text-center bg-gold text-black font-bold py-3 rounded-btn btn-glow">
                    {t("cart.checkout")}
                </Link>
            ) : null}
            <button type="button" onClick={clearCart} className="w-full mt-2 text-red-500 text-sm hover:underline">
                {t("cart.clear")}
            </button>
        </div>
    );
}
