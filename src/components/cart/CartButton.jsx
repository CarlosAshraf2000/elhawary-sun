import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useLocale } from "../../hooks/useLocale";

function quantityLabel(count, t) {
    if (count === 1) return t("common.piecesOne");
    if (count === 2) return t("common.piecesTwo");
    if (count >= 3 && count <= 10) return t("common.piecesFew", { count });
    return t("common.piecesMany", { count });
}

export default function CartButton({ onClick }) {
    const { totalItems } = useCart();
    const { t } = useLocale();

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${t("nav.cart")} (${quantityLabel(totalItems, t)})`}
            className="relative p-2 text-xl text-dark hover:text-gold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
        >
            <FaShoppingCart />
            {totalItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center cart-badge-pop">
                    {totalItems > 99 ? "99+" : totalItems}
                </span>
            )}
        </button>
    );
}
