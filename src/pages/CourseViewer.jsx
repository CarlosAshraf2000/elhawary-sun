import { useSearchParams, Link } from "react-router-dom";
import PageLayout from "../components/ui/PageLayout";
import { useLocale } from "../hooks/useLocale";
import { isAllowedPdfUrl } from "../utils/validation";

export default function CourseViewer() {
    const [params] = useSearchParams();
    const pdf = params.get("pdf");
    const { t } = useLocale();

    if (!pdf) {
        return (
            <PageLayout title={t("courses.viewerTitle")}>
                <p className="text-center text-gray-600 mb-6">{t("courses.noPdf")}</p>
                <div className="text-center">
                    <Link to="/courses" className="text-gold font-semibold hover:underline">
                        {t("courses.backToCourses")}
                    </Link>
                </div>
            </PageLayout>
        );
    }

    if (!isAllowedPdfUrl(pdf)) {
        return (
            <PageLayout title={t("courses.viewerTitle")}>
                <p className="text-center text-red-600 mb-6" role="alert">{t("courses.invalidPdf")}</p>
                <div className="text-center">
                    <Link to="/courses" className="text-gold font-semibold hover:underline">
                        {t("courses.backToCourses")}
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={t("courses.viewerTitle")}>
            <iframe
                title={t("courses.viewerIframeTitle")}
                src={pdf}
                className="w-full min-h-[60vh] md:min-h-[80vh] rounded-card shadow-card"
                style={{ border: "none" }}
                sandbox="allow-scripts allow-same-origin allow-popups"
            />
        </PageLayout>
    );
}
