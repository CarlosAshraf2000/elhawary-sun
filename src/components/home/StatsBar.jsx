import { Link } from "react-router-dom";
import { FaShieldAlt, FaAward, FaUsers, FaHeadset } from "react-icons/fa";
import SectionTitle from "../ui/SectionTitle";
import Card3D from "../ui/Card3D";
import GlassPanel from "../ui/GlassPanel";
import { useLocale } from "../../hooks/useLocale";
import { getLocaleData } from "../../i18n";

const iconMap = { quality: FaAward, warranty: FaShieldAlt, experience: FaUsers, support: FaHeadset };

export default function StatsBar() {
    const { lang } = useLocale();
    const stats = getLocaleData(lang).home.stats;

    return (
        <section className="relative py-16 overflow-hidden text-white" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)" }}>
            <div className="absolute inset-0 bg-solar-glow opacity-30" />
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {stats.map((stat, i) => (
                    <GlassPanel key={stat.label} variant="dark" className={`p-6 text-center animate-fade-up stagger-${i + 1}`}>
                        <p className="text-3xl md:text-4xl font-extrabold text-gold mb-2 text-3d">{stat.value}</p>
                        <p className="text-gray-300">{stat.label}</p>
                    </GlassPanel>
                ))}
            </div>
        </section>
    );
}

export function WhyChooseUs() {
    const { lang, t } = useLocale();
    const items = getLocaleData(lang).home.whyChooseUs;

    return (
        <section className="py-20 mesh-bg">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle>{t("home.whyTitle")}</SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item) => {
                        const Icon = iconMap[item.icon] || FaAward;
                        return (
                            <Card3D key={item.title}>
                                <GlassPanel className="p-6 text-center h-full">
                                    <Icon className="text-gold text-4xl mx-auto mb-4 animate-float" />
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </GlassPanel>
                            </Card3D>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    const { lang, t } = useLocale();
    const testimonials = getLocaleData(lang).home.testimonials;

    return (
        <section className="py-20 mesh-bg dark:bg-surface">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle>{t("home.testimonialsTitle")}</SectionTitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <Card3D key={item.name}>
                            <GlassPanel className="p-6 h-full card-tilt">
                                <p className="text-4xl text-gold/30 font-serif leading-none mb-2">"</p>
                                <p className="text-gray-700 mb-4 leading-relaxed">{item.text}</p>
                                <footer>
                                    <p className="font-bold text-gold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </footer>
                            </GlassPanel>
                        </Card3D>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CTABanner() {
    const { t } = useLocale();

    return (
        <section className="py-20 relative overflow-hidden mesh-bg">
            <div className="absolute inset-0 bg-gold/10" />
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <GlassPanel variant="gold" className="p-10 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-3d">{t("home.ctaTitle")}</h2>
                    <p className="text-gray-700 text-lg mb-8">{t("home.ctaSubtitle")}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="inline-block bg-dark text-white px-8 py-4 rounded-btn font-bold btn-glow">
                            {t("home.ctaButton")}
                        </Link>
                        <Link to="/products" className="inline-block bg-gold text-black px-8 py-4 rounded-btn font-bold btn-glow">
                            {t("common.shopNow")}
                        </Link>
                    </div>
                </GlassPanel>
            </div>
        </section>
    );
}
