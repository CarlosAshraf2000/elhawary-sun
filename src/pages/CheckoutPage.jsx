import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { createCartOrder, buildWhatsAppMessage } from "../api/orders";
import { validateCoupon } from "../api/coupons";
import { siteContent } from "../data/siteContent";
import { formatPriceWithUnit } from "../utils/currency";
import { useLocale } from "../hooks/useLocale";
import PageLayout from "../components/ui/PageLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import GlassPanel from "../components/ui/GlassPanel";
import CartItem from "../components/cart/CartItem";
import PageMeta from "../components/seo/PageMeta";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { t, currency, lang } = useLocale();
    const priceOpts = { currency, locale: lang === "en" ? "en-US" : "ar-EG", t };
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponMessage, setCouponMessage] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [whatsappWarning, setWhatsappWarning] = useState("");

    if (items.length === 0 && !success) return <Navigate to="/cart" replace />;

    const discount = appliedCoupon?.discount || 0;
    const finalTotal = Math.max(0, totalPrice - discount);

    const handleApplyCoupon = async () => {
        setCouponLoading(true);
        setCouponMessage("");
        const result = await validateCoupon(couponInput, totalPrice);
        setCouponLoading(false);
        if (result.valid) {
            setAppliedCoupon({ code: result.coupon.code, couponId: result.coupon.id, discount: result.discount });
            setCouponMessage(t("checkout.couponApplied"));
        } else {
            setAppliedCoupon(null);
            setCouponMessage(result.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setWhatsappWarning("");
        setSubmitting(true);
        const customerInfo = { name, phone, address, notes };
        const couponInfo = appliedCoupon || {};
        const result = await createCartOrder(items, customerInfo, couponInfo);
        if (!result.success) {
            setError(t("common.errorGeneric"));
            setSubmitting(false);
            return;
        }
        clearCart();
        const waMsg = buildWhatsAppMessage(items, customerInfo, finalTotal, couponInfo);
        const waWindow = window.open(`${siteContent.social.whatsapp}?text=${waMsg}`, "_blank");
        if (!waWindow) setWhatsappWarning(t("checkout.whatsappBlocked"));
        setSuccess(true);
        setSubmitting(false);
    };

    if (success) {
        return (
            <PageLayout title={t("checkout.successTitle")}>
                <PageMeta titleKey="checkout.successTitle" />
                <GlassPanel variant="gold" className="max-w-lg mx-auto p-10 text-center">
                    <p className="text-2xl font-bold text-green-700 mb-4">{t("checkout.successMessage")}</p>
                    <p className="text-gray-600 mb-4">{t("checkout.successDetail")}</p>
                    {whatsappWarning && <p role="status" className="text-amber-700 text-sm mb-4">{whatsappWarning}</p>}
                    <Link to="/products" className="text-gold font-bold hover:underline">{t("checkout.continueShopping")}</Link>
                </GlassPanel>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={t("checkout.title")}>
            <PageMeta titleKey="checkout.title" />
            <div className="grid lg:grid-cols-2 gap-10">
                <GlassPanel className="p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6">{t("checkout.deliveryInfo")}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label={t("checkout.name")} name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <FormField label={t("checkout.phone")} name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        <FormField label={t("checkout.address")} name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        <FormField label={t("checkout.notes")} name="notes" as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={submitting}>
                            <FaWhatsapp />
                            {submitting ? t("checkout.submitting") : t("checkout.submit")}
                        </Button>
                        {error && <p role="alert" className="text-red-600 text-center font-semibold">{error}</p>}
                    </form>
                </GlassPanel>
                <GlassPanel className="p-6">
                    <h2 className="text-xl font-bold mb-4">{t("checkout.yourOrder", { count: items.length })}</h2>
                    <div className="max-h-80 overflow-y-auto mb-4">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} compact />
                        ))}
                    </div>
                    <div className="border-t pt-4 mb-4">
                        <label className="block text-sm font-semibold mb-2">{t("checkout.coupon")}</label>
                        <div className="flex gap-2">
                            <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder={t("checkout.couponPlaceholder")} className="flex-1 p-2 border rounded" />
                            <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}>
                                {couponLoading ? "…" : t("common.apply")}
                            </Button>
                        </div>
                        {couponMessage && <p className={`text-sm mt-2 ${appliedCoupon ? "text-green-600" : "text-red-600"}`}>{couponMessage}</p>}
                    </div>
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between text-gray-700">
                            <span>{t("checkout.subtotal")}</span>
                            <span>{formatPriceWithUnit(totalPrice, priceOpts)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>{t("checkout.discount")} ({appliedCoupon.code})</span>
                                <span>- {formatPriceWithUnit(discount, priceOpts)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-gold pt-2">
                            <span>{t("cart.total")}</span>
                            <span>{formatPriceWithUnit(finalTotal, priceOpts)}</span>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </PageLayout>
    );
}
