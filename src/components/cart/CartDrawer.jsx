import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useLocale } from "../../hooks/useLocale";
import { formatPriceWithUnit } from "../../utils/currency";
import CartItem from "./CartItem";

export default function CartDrawer({ open, onClose }) {
    const { items, totalPrice } = useCart();
    const { t, currency, lang, dir } = useLocale();
    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    return (
        <>
            <div
                className={`fixed top-0 ${dir === "rtl" ? "left-0 -translate-x-full" : "right-0 translate-x-full"} h-full w-full max-w-md glass-drawer z-50 transform transition-transform duration-300 shadow-3d-lg ${
                    open ? "!translate-x-0" : ""
                }`}
                dir={dir}
                role="dialog"
                aria-modal="true"
                aria-label={t("cart.drawerTitle")}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gold">{t("cart.title")}</h2>
                        <button type="button" onClick={onClose} className="text-2xl hover:text-gold" aria-label={t("common.close")}>✕</button>
                    </div>
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <p className="mb-4">{t("cart.empty")}</p>
                            <Link to="/products" onClick={onClose} className="text-gold font-bold hover:underline">{t("cart.browseProducts")}</Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-1">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} compact />
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <div className="flex justify-between text-lg font-bold mb-4">
                                    <span>{t("cart.total")}</span>
                                    <span className="text-gold">{formatPriceWithUnit(totalPrice, priceOpts)}</span>
                                </div>
                                <Link to="/checkout" onClick={onClose} className="block w-full text-center bg-gold text-black font-bold py-3 rounded-btn btn-glow">
                                    {t("cart.checkout")}
                                </Link>
                                <Link to="/cart" onClick={onClose} className="block w-full text-center mt-2 text-gray-300 hover:text-gold">
                                    {t("cart.viewFullCart")}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {open && (
                <button type="button" className="fixed inset-0 glass-overlay z-40" onClick={onClose} aria-label={t("common.close")} />
            )}
        </>
    );
}
