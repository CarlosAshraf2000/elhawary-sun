import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import PageLayout from "../components/ui/PageLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";

export default function QuotePage() {
    const { t } = useLocale();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [system, setSystem] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const sendQuote = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await addDoc(collection(db, "quotes"), {
                name, phone, city, system, done: false, createdAt: serverTimestamp(),
            });
            setSent(true);
        } catch {
            setError(t("common.errorGeneric"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageLayout title={t("quote.title")}>
            <PageMeta titleKey="quote.title" />
            {sent ? (
                <div className="text-center text-2xl text-green-600 font-bold" role="status">
                    {t("quote.success")}
                </div>
            ) : (
                <form onSubmit={sendQuote} className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-card shadow-card space-y-6">
                    <FormField label={t("quote.name")} name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <FormField label={t("quote.phone")} name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <FormField label={t("quote.city")} name="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <FormField label={t("quote.system")} name="system" as="textarea" rows={4} value={system} onChange={(e) => setSystem(e.target.value)} placeholder={t("quote.systemPlaceholder")} required />
                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? t("quote.submitting") : t("quote.submit")}
                    </Button>
                    {error && <p role="alert" className="text-red-600 text-center font-semibold">{error}</p>}
                </form>
            )}
        </PageLayout>
    );
}
