import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { siteContent } from "../data/siteContent";
import PageLayout from "../components/ui/PageLayout";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";

export default function ContactPage() {
    const { company, social, mapsEmbed } = siteContent;
    const { t } = useLocale();

    return (
        <PageLayout title={t("contact.title")}>
            <PageMeta titleKey="contact.title" />
            <div className="max-w-3xl mx-auto glass-card-light p-8 md:p-10 mb-12">
                <div className="space-y-8 text-xl font-semibold text-gray-800">
                    <p className="flex items-center gap-3 flex-wrap">
                        <FaPhoneAlt className="text-gold text-2xl shrink-0" />
                        <span>{t("contact.phone")}:</span>
                        <a href={`tel:${company.phone}`} className="text-gray-700 font-normal hover:text-gold transition" dir="ltr">
                            {company.phone}
                        </a>
                    </p>
                    <p className="flex items-center gap-3 flex-wrap">
                        <FaWhatsapp className="text-green-600 text-3xl shrink-0" />
                        <span>{t("contact.whatsapp")}:</span>
                        <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-700 font-normal hover:text-gold transition" dir="ltr">
                            {company.whatsapp}
                        </a>
                    </p>
                    <p className="flex items-center gap-3 flex-wrap">
                        <FaMapMarkerAlt className="text-gold text-3xl shrink-0" />
                        <span>{t("contact.address")}:</span>
                        <span className="text-gray-700 font-normal">{t("company.address")}</span>
                    </p>
                    <p className="flex items-center gap-3 flex-wrap">
                        <FaEnvelope className="text-gold text-2xl shrink-0" />
                        <span>{t("contact.email")}:</span>
                        <a href={`mailto:${company.email}`} className="text-gray-700 font-normal hover:text-gold transition">
                            {company.email}
                        </a>
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto glass-map rounded-card overflow-hidden shadow-3d-lg">
                <iframe
                    title={t("contact.mapTitle")}
                    src={mapsEmbed}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </PageLayout>
    );
}
