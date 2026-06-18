import { Link } from "react-router-dom";
import { FaShoppingCart, FaPlus } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useLocale } from "../../hooks/useLocale";
import {
    getProductImage,
    isOnSale,
    getEffectivePrice,
    formatDiscountBadge,
} from "../../data/productDefaults";
import { formatPriceWithUnit } from "../../utils/currency";
import Button from "../ui/Button";
import Card3D from "../ui/Card3D";
import SiteImage from "../ui/SiteImage";

export default function ProductCard({ product, onAddToCart }) {
    const { addItem } = useCart();
    const { t, lang, currency } = useLocale();
    const img = getProductImage(product);
    const onSale = isOnSale(product);
    const effectivePrice = getEffectivePrice(product);
    const discountBadge = formatDiscountBadge(product);
    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    const handleAdd = (e) => {
        e.preventDefault();
        addItem(product, 1);
        onAddToCart?.();
    };

    return (
        <Card3D className="h-full">
            <article className="bg-white rounded-card shadow-3d-sm hover:shadow-3d-lg overflow-hidden h-full flex flex-col transition-shadow duration-300">
                <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                    <SiteImage src={img} alt={product.title} variant="card" gradient />
                    {product.featured && (
                        <span className="absolute top-3 right-3 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-glow z-10">
                            {t("shop.featured")}
                        </span>
                    )}
                    {onSale && discountBadge && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-glow z-10">
                            {discountBadge}
                        </span>
                    )}
                    <span className="absolute bottom-3 left-3 glass-badge text-gold font-bold px-3 py-1 rounded-btn text-sm z-10">
                        {onSale ? (
                            <>
                                <span className="line-through text-gray-400 text-xs ml-1">
                                    {formatPriceWithUnit(product.price, priceOpts)}
                                </span>{" "}
                                {formatPriceWithUnit(effectivePrice, priceOpts)}
                            </>
                        ) : (
                            formatPriceWithUnit(product.price, priceOpts)
                        )}
                    </span>
                </Link>

                <div className="p-5 flex flex-col flex-1">
                    <Link to={`/product/${product.id}`}>
                        <h2 className="text-xl font-bold mb-2 hover:text-gold transition">{product.title}</h2>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-2 flex-1">{product.description}</p>

                    <div className="flex gap-2 mt-4">
                        <Button
                            type="button"
                            onClick={handleAdd}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <FaShoppingCart />
                            {t("shop.addToCart")}
                        </Button>
                        <Button as={Link} to={`/product/${product.id}`} variant="outline" className="px-4">
                            <FaPlus className="sr-only" />
                            {t("common.details")}
                        </Button>
                    </div>
                </div>
            </article>
        </Card3D>
    );
}
