import { Link } from "react-router-dom";
import PageLayout from "../components/ui/PageLayout";
import CartItem, { CartSummary } from "../components/cart/CartItem";
import { useCart } from "../hooks/useCart";
import GlassPanel from "../components/ui/GlassPanel";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";

export default function CartPage() {
    const { items } = useCart();
    const { t } = useLocale();

    if (items.length === 0) {
        return (
            <PageLayout title={t("cart.title")}>
                <PageMeta titleKey="cart.title" />
                <GlassPanel className="max-w-md mx-auto p-10 text-center">
                    <p className="text-gray-600 mb-6">{t("cart.empty")}</p>
                    <Link to="/products" className="text-gold font-bold hover:underline">{t("cart.browseProducts")}</Link>
                </GlassPanel>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={t("cart.title")}>
            <PageMeta titleKey="cart.title" />
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <GlassPanel className="p-6">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </GlassPanel>
                </div>
                <CartSummary />
            </div>
        </PageLayout>
    );
}
