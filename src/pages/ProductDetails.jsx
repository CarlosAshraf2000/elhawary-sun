import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../hooks/useCart";
import {
    getProductImage,
    getCategoryLabel,
    isOnSale,
    getEffectivePrice,
    isInStock,
    getAvailableStock,
} from "../data/productDefaults";
import { formatPriceWithUnit } from "../utils/currency";
import { useLocale } from "../hooks/useLocale";
import Button from "../components/ui/Button";
import GlassPanel from "../components/ui/GlassPanel";
import Card3D from "../components/ui/Card3D";
import SiteImage from "../components/ui/SiteImage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageMeta from "../components/seo/PageMeta";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem, items } = useCart();
    const { t, currency, lang, dir } = useLocale();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [stockError, setStockError] = useState("");

    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };

    useEffect(() => {
        (async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const ref = doc(db, "products", id);
                const snap = await getDoc(ref);
                if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
                else setNotFound(true);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <LoadingSpinner message={t("shop.loadingProduct")} />;

    if (notFound) {
        return (
            <section className="py-20 text-center mesh-bg" dir={dir}>
                <GlassPanel className="max-w-md mx-auto p-8">
                    <h1 className="text-3xl font-bold mb-4">{t("shop.productNotFound")}</h1>
                    <Link to="/products" className="text-gold font-semibold hover:underline">{t("shop.backToProducts")}</Link>
                </GlassPanel>
            </section>
        );
    }

    const img = getProductImage(product);
    const specs = product.specs || {};
    const onSale = isOnSale(product);
    const effectivePrice = getEffectivePrice(product);
    const inStock = isInStock(product);
    const stock = getAvailableStock(product);
    const cartQty = items.find((i) => i.id === product.id)?.quantity || 0;
    const maxQty = stock === Infinity ? 99 : Math.max(0, stock - cartQty);

    const handleAdd = () => {
        if (!inStock) {
            setStockError(t("shop.outOfStock"));
            return;
        }
        if (quantity > maxQty) {
            setStockError(t("shop.stockExceeded"));
            return;
        }
        setStockError("");
        addItem(product, quantity);
    };

    const handleBuyNow = () => {
        handleAdd();
        if (inStock && quantity <= maxQty) navigate("/checkout");
    };

    return (
        <section className="py-16 mesh-bg min-h-screen" dir={dir}>
            <PageMeta titleKey="shop.storeTitle" />
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                <Card3D intensity={15}>
                    <GlassPanel className="p-4 overflow-hidden relative">
                        <SiteImage src={img} alt={product.title} variant="card" className="rounded-card min-h-[320px]" />
                        {!inStock && (
                            <span className="absolute bottom-6 inset-x-6 bg-red-600 text-white text-center py-2 font-bold rounded">
                                {t("shop.soldOut")}
                            </span>
                        )}
                    </GlassPanel>
                </Card3D>
                <div>
                    <span className="text-gold font-semibold text-sm">{getCategoryLabel(product.category, t)}</span>
                    <h1 className="text-4xl font-extrabold mb-4 text-3d">{product.title}</h1>
                    <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
                    <p className="text-gold text-4xl font-bold mb-4">
                        {onSale ? (
                            <>
                                <span className="line-through text-gray-400 text-2xl ml-2">{formatPriceWithUnit(product.price, priceOpts)}</span>
                                {formatPriceWithUnit(effectivePrice, priceOpts)}
                                <span className="block text-sm text-red-600 font-semibold mt-1">{t("shop.specialOffer")}</span>
                            </>
                        ) : (
                            formatPriceWithUnit(product.price, priceOpts)
                        )}
                    </p>
                    {inStock && stock !== Infinity && stock <= 10 && (
                        <p className="text-amber-700 text-sm mb-4">* {t("shop.stockLeft", { count: stock })}</p>
                    )}
                    {(specs.power || specs.warranty) && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {specs.power && (
                                <GlassPanel variant="light" className="glass-spec p-4 text-center">
                                    <p className="text-sm text-gray-500">{t("shop.power")}</p>
                                    <p className="font-bold">{specs.power}</p>
                                </GlassPanel>
                            )}
                            {specs.warranty && (
                                <GlassPanel variant="light" className="glass-spec p-4 text-center">
                                    <p className="text-sm text-gray-500">{t("shop.warranty")}</p>
                                    <p className="font-bold">{specs.warranty}</p>
                                </GlassPanel>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-semibold">{t("shop.quantity")}:</span>
                        <div className="flex items-center gap-3 glass-qty rounded-btn px-2 py-1">
                            <button type="button" disabled={!inStock} onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-gold">
                                <FaMinus />
                            </button>
                            <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                            <button type="button" disabled={!inStock} onClick={() => setQuantity((q) => Math.min(maxQty || 1, q + 1))} className="w-10 h-10 flex items-center justify-center hover:text-gold">
                                <FaPlus />
                            </button>
                        </div>
                    </div>
                    {stockError && <p className="text-red-600 mb-4" role="alert">{stockError}</p>}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button type="button" onClick={handleAdd} disabled={!inStock} className="flex-1 flex items-center justify-center gap-2">
                            <FaShoppingCart />
                            {t("shop.addToCart")}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleBuyNow} disabled={!inStock} className="flex-1">
                            {t("shop.buyNow")}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
