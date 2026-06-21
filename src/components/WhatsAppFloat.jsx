import { FaWhatsapp } from "react-icons/fa";
import { siteContent } from "../data/siteContent";
import { useLocale } from "../hooks/useLocale";

export default function WhatsAppFloat() {
    const { t, dir } = useLocale();
    const positionClass = dir === "rtl" ? "right-6" : "left-6";

    return (
        <a
            href={siteContent.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("whatsapp.floatLabel")}
            className={`fixed bottom-6 ${positionClass} z-40 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700`}
        >
            <FaWhatsapp className="text-2xl" />
        </a>
    );
}
