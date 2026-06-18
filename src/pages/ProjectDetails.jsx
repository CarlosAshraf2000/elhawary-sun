import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import GlassPanel from "../components/ui/GlassPanel";
import SiteImage from "../components/ui/SiteImage";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { defaultProduct } from "../data/productDefaults";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProjectDetails() {
    const { id } = useParams();
    const { t, dir } = useLocale();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const ref = doc(db, "projects", id);
                const snap = await getDoc(ref);
                if (snap.exists()) setProject(snap.data());
                else setNotFound(true);
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <LoadingSpinner message={t("projects.loading")} />;

    if (notFound) {
        return (
            <section className="py-20 text-center mesh-bg" dir={dir}>
                <h1 className="text-3xl font-bold mb-4">{t("projects.notFound")}</h1>
                <Link to="/projects" className="text-gold font-semibold hover:underline">{t("projects.back")}</Link>
            </section>
        );
    }

    return (
        <div className="py-10 max-w-5xl mx-auto px-6 mesh-bg min-h-screen" dir={dir}>
            <PageMeta titleKey="projects.pageTitle" />
            <h1 className="text-4xl font-bold text-gold mb-8 text-center text-3d">{project.title}</h1>
            <GlassPanel className="overflow-hidden mb-10 p-2">
                <Swiper navigation pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} modules={[Navigation, Pagination, Autoplay]} className="w-full rounded-card overflow-hidden">
                    {project.images?.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative aspect-video bg-gradient-to-b from-gray-100 to-gray-200">
                                <SiteImage src={img} alt={t("projects.imageAlt", { title: project.title, n: i + 1 })} variant="banner" className="!aspect-video" fallback={defaultProduct} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </GlassPanel>
            <GlassPanel className="p-6">
                <p className="text-lg text-gray-800 leading-8 text-center">{project.description}</p>
            </GlassPanel>
        </div>
    );
}
