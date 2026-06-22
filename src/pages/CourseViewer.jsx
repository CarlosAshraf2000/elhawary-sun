import { useSearchParams, Link } from "react-router-dom";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import PageLayout from "../components/ui/PageLayout";
import { useLocale } from "../hooks/useLocale";
import { getPdfDownloadUrl, getPdfViewerUrl, isAllowedPdfUrl } from "../utils/validation";

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

    const viewerUrl = getPdfViewerUrl(pdf);
    const downloadUrl = getPdfDownloadUrl(pdf);

    return (
        <PageLayout title={t("courses.viewerTitle")}>
            <div className="flex flex-wrap gap-3 justify-center mb-4">
                <a
                    href={viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold text-black px-5 py-2.5 rounded-btn font-bold btn-glow"
                >
                    <FaExternalLinkAlt />
                    {t("courses.openPdf")}
                </a>
                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 border-2 border-gold text-gold px-5 py-2.5 rounded-btn font-bold hover:bg-gold hover:text-black transition"
                >
                    <FaDownload />
                    {t("courses.downloadPdf")}
                </a>
                <Link to="/courses" className="inline-flex items-center px-5 py-2.5 text-gray-600 hover:text-gold font-semibold">
                    {t("courses.backToCourses")}
                </Link>
            </div>

            <object
                data={viewerUrl}
                type="application/pdf"
                className="w-full min-h-[65vh] md:min-h-[80vh] rounded-card shadow-card bg-gray-100"
                aria-label={t("courses.viewerIframeTitle")}
            >
                <div className="p-8 text-center bg-white rounded-card shadow-card">
                    <p className="text-gray-600 mb-4">{t("courses.pdfEmbedFallback")}</p>
                    <a
                        href={viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold font-bold hover:underline"
                    >
                        {t("courses.openPdf")}
                    </a>
                </div>
            </object>

            <p className="text-xs text-gray-500 text-center mt-3">{t("courses.pdfViewerHint")}</p>
        </PageLayout>
    );
}
