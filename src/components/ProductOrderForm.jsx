import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import FormField from "./ui/FormField";
import Button from "./ui/Button";
import { useLocale } from "../hooks/useLocale";

export default function ProductOrderForm({ product }) {
    const { t } = useLocale();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        try {
            setSending(true);
            await addDoc(collection(db, "orders"), {
                product: product.title,
                productId: product.id,
                name,
                phone,
                done: false,
                createdAt: Timestamp.now(),
            });
            setSuccess(true);
            setName("");
            setPhone("");
        } catch {
            setError(t("common.errorGeneric"));
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-card shadow-card space-y-4">
            <h2 className="text-xl font-bold mb-2">{t("shop.orderProduct", { title: product.title })}</h2>

            <FormField
                label={t("checkout.name")}
                name="order-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <FormField
                label={t("checkout.phone")}
                name="order-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />

            <Button type="submit" className="w-full" disabled={sending}>
                {sending ? t("shop.orderSubmitting") : t("shop.orderSubmit")}
            </Button>

            {success && (
                <p role="status" className="text-green-600 font-semibold text-center">
                    {t("shop.orderSuccess")}
                </p>
            )}
            {error && (
                <p role="alert" className="text-red-600 font-semibold text-center">
                    {error}
                </p>
            )}
        </form>
    );
}
