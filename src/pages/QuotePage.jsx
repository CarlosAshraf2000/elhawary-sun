import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { siteContent } from "../data/siteContent";
import PageLayout from "../components/ui/PageLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { isValidName, isValidPhone, isValidCity, isValidSystemDescription } from "../utils/validation";
import { buildQuoteWhatsAppMessage, openQuoteWhatsApp } from "../utils/whatsapp";

export default function QuotePage() {
    const { t, lang } = useLocale();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [system, setSystem] = useState("");
    const [sent, setSent] = useState(false);
    const [saveWarning, setSaveWarning] = useState("");
    const [lastQuote, setLastQuote] = useState(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const locale = lang === "en" ? "en-US" : "ar-EG";

    const sendQuote = async (e) => {
        e.preventDefault();
        setError("");
        setSaveWarning("");

        if (!isValidName(name)) {
            setError(t("validation.invalidName"));
            return;
        }
        if (!isValidPhone(phone)) {
            setError(t("validation.invalidPhone"));
            return;
        }
        if (!isValidCity(city)) {
            setError(t("validation.invalidCity"));
            return;
        }
        if (!isValidSystemDescription(system)) {
            setError(t("validation.invalidSystem"));
            return;
        }

        setSubmitting(true);
        const quoteData = {
            name: name.trim(),
            phone: phone.trim(),
            city: city.trim(),
            system: system.trim(),
        };

        openQuoteWhatsApp(quoteData, locale);
        setLastQuote(quoteData);

        try {
            await addDoc(collection(db, "quotes"), {
                ...quoteData,
                done: false,
                createdAt: serverTimestamp(),
            });
        } catch {
            setSaveWarning(t("quote.saveFailed"));
        }

        setSent(true);
        setSubmitting(false);
    };

    const whatsappRetryUrl = lastQuote
        ? `${siteContent.social.whatsapp}?text=${buildQuoteWhatsAppMessage(lastQuote, locale)}`
        : siteContent.social.whatsapp;

    return (
        <PageLayout title={t("quote.title")}>
            <PageMeta titleKey="quote.title" />
            {sent ? (
                <div className="text-center max-w-lg mx-auto space-y-4" role="status">
                    <p className="text-2xl text-green-600 font-bold">{t("quote.success")}</p>
                    <p className="text-gray-600">{t("quote.successDetail")}</p>
                    {saveWarning && (
                        <p className="text-amber-700 text-sm font-semibold">{saveWarning}</p>
                    )}
                    <a
                        href={whatsappRetryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-btn font-bold"
                    >
                        <FaWhatsapp />
                        {t("quote.openWhatsapp")}
                    </a>
                </div>
            ) : (
                <form onSubmit={sendQuote} className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-card shadow-card space-y-6">
                    <FormField label={t("quote.name")} name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <FormField label={t("quote.phone")} name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <FormField label={t("quote.city")} name="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <FormField label={t("quote.system")} name="system" as="textarea" rows={4} value={system} onChange={(e) => setSystem(e.target.value)} placeholder={t("quote.systemPlaceholder")} required />
                    <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={submitting}>
                        <FaWhatsapp />
                        {submitting ? t("quote.submitting") : t("quote.submitWhatsapp")}
                    </Button>
                    {error && <p role="alert" className="text-red-600 text-center font-semibold">{error}</p>}
                </form>
            )}
        </PageLayout>
    );
}
