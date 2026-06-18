import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, limit, query } from "firebase/firestore";
import { db } from "../../firebase";
import SectionTitle from "../ui/SectionTitle";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";
import Card3D from "../ui/Card3D";
import GlassPanel from "../ui/GlassPanel";
import SiteImage from "../ui/SiteImage";
import { useLocale } from "../../hooks/useLocale";

export default function FeaturedProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLocale();

    useEffect(() => {
        const q = query(collection(db, "projects"), limit(3));
        const unsub = onSnapshot(q, (snap) => {
            setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    return (
        <section className="py-20 mesh-bg">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle>{t("home.projectsTitle")}</SectionTitle>
                {loading ? (
                    <LoadingSpinner message={t("projects.loading")} />
                ) : projects.length === 0 ? (
                    <EmptyState message={t("projects.empty")} />
                ) : (
                    <>
                        <div className="grid md:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Card3D key={project.id}>
                                    <Link to={`/project/${project.id}`} className="block h-full">
                                        <GlassPanel className="overflow-hidden h-full hover:shadow-3d-lg transition-shadow">
                                            {project.images?.[0] ? (
                                                <SiteImage src={project.images[0]} alt={project.title} variant="project" gradient />
                                            ) : (
                                                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-500">
                                                    {t("projects.noImage")}
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h3 className="text-xl font-bold">{project.title}</h3>
                                            </div>
                                        </GlassPanel>
                                    </Link>
                                </Card3D>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <Link to="/projects" className="text-gold font-bold hover:underline btn-glow inline-block px-6 py-2">
                                {t("home.viewAllProjects")}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
