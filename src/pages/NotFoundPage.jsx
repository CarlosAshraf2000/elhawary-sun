import { Link } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";
import PageMeta from "../components/seo/PageMeta";

export default function NotFoundPage() {
    const { t, dir } = useLocale();

    return (
        <div className="min-h-[60vh] flex items-center justify-center mesh-bg" dir={dir}>
            <PageMeta titleKey="common.notFoundTitle" />
            <div className="glass-card-light p-10 text-center max-w-md mx-6">
                <h1 className="text-4xl font-bold text-3d mb-4">{t("common.notFoundTitle")}</h1>
                <p className="text-gray-600 mb-6">{t("common.notFound")}</p>
                <Link to="/" className="text-gold font-bold hover:underline">{t("common.backHome")}</Link>
            </div>
        </div>
    );
}
