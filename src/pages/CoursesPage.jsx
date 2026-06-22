import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaDownload } from "react-icons/fa";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import PageLayout from "../components/ui/PageLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { getPdfDownloadUrl } from "../utils/validation";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const { t } = useLocale();

    useEffect(() => {
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoadError("");
            setLoading(false);
        }, () => {
            setLoadError(t("common.loadError"));
            setLoading(false);
        });
        return unsub;
    }, [t]);

    return (
        <PageLayout title={t("courses.title")}>
            <PageMeta titleKey="courses.title" />
            {loading ? (
                <LoadingSpinner message={t("courses.loading")} />
            ) : loadError ? (
                <EmptyState message={loadError} />
            ) : courses.length === 0 ? (
                <EmptyState message={t("courses.empty")} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        <article key={c.id} className="bg-white shadow-card rounded-card p-4 flex flex-col">
                            {c.imageURL && (
                                <img
                                    src={c.imageURL}
                                    alt={c.title}
                                    className="w-full h-48 object-cover rounded"
                                    loading="lazy"
                                />
                            )}
                            <h3 className="text-xl font-bold mt-4">{c.title}</h3>
                            <p className="text-gray-600 mt-2 line-clamp-3 flex-1">{c.description}</p>

                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                {c.pdfURL ? (
                                    <>
                                        <Button
                                            as={Link}
                                            to={`/course-viewer?pdf=${encodeURIComponent(c.pdfURL)}`}
                                            className="flex-1 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <FaBookOpen />
                                            {t("courses.viewCourse")}
                                        </Button>
                                        <a
                                            href={getPdfDownloadUrl(c.pdfURL)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-btn border-2 border-gold text-gold hover:bg-gold hover:text-black transition"
                                        >
                                            <FaDownload />
                                            {t("courses.downloadPdf")}
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-amber-700 text-sm">{t("courses.noPdf")}</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
