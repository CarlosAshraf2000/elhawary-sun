import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import PageLayout from "../components/ui/PageLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import Card3D from "../components/ui/Card3D";
import GlassPanel from "../components/ui/GlassPanel";
import SiteImage from "../components/ui/SiteImage";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { truncateDescription } from "../utils/text";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLocale();

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "projects"), (snap) => {
            setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    return (
        <PageLayout title={t("projects.pageTitle")} className="mesh-bg">
            <PageMeta titleKey="projects.pageTitle" />
            {loading ? (
                <LoadingSpinner message={t("projects.loading")} />
            ) : projects.length === 0 ? (
                <EmptyState message={t("projects.empty")} />
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <Card3D key={project.id}>
                            <Link to={`/project/${project.id}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-card">
                                <GlassPanel className="overflow-hidden h-full hover:shadow-3d-lg transition-shadow">
                                    {project.images?.length > 0 ? (
                                        <SiteImage src={project.images[0]} alt={project.title} variant="project" gradient />
                                    ) : (
                                        <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                            {t("projects.noImageAvailable")}
                                        </div>
                                    )}
                                    <div className="p-4 text-center">
                                        <h2 className="text-2xl font-bold">{project.title}</h2>
                                        <p className="text-gray-600 mt-2">{truncateDescription(project.description)}</p>
                                    </div>
                                </GlassPanel>
                            </Link>
                        </Card3D>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
