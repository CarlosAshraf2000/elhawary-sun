import SectionTitle from "../components/ui/SectionTitle";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { getLocaleData } from "../i18n";

export default function AboutPage() {
    const { t, lang } = useLocale();
    const about = getLocaleData(lang).about;

    return (
        <section className="min-h-screen mesh-bg py-16 md:py-24 px-6">
            <PageMeta titleKey="about.title" />
            <div className="max-w-5xl mx-auto">
                <div className="glass-card-light p-8 md:p-12 text-center mb-12 animate-fadeIn">
                    <div className="flex justify-center mb-4">
                        <span className="text-gold text-5xl" aria-hidden="true">☀️</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-3d">{t("about.title")}</h1>
                    <div className="w-28 h-1 bg-gold mx-auto mb-8 rounded-full" />
                    <p className="text-xl leading-loose text-gray-800 mb-6">
                        {t("about.intro1", { name: t("company.name") })}
                    </p>
                    <p className="text-xl leading-loose text-gray-800">{t("about.intro2")}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card-light p-8">
                        <h2 className="text-2xl font-bold text-gold mb-4">{t("about.vision")}</h2>
                        <p className="text-gray-700 leading-relaxed">{about.visionText}</p>
                    </div>
                    <div className="glass-card-light p-8">
                        <h2 className="text-2xl font-bold text-gold mb-4">{t("about.mission")}</h2>
                        <p className="text-gray-700 leading-relaxed">{about.missionText}</p>
                    </div>
                </div>

                <SectionTitle>{t("about.valuesTitle")}</SectionTitle>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {about.values.map((value) => (
                        <div key={value.title} className="glass-card-light p-6 text-center card-tilt">
                            <h3 className="text-xl font-bold text-gold mb-2">{value.title}</h3>
                            <p className="text-gray-600 text-sm">{value.description}</p>
                        </div>
                    ))}
                </div>

                <SectionTitle>{t("about.timelineTitle")}</SectionTitle>
                <div className="space-y-6 max-w-2xl mx-auto">
                    {about.timeline.map((item) => (
                        <div key={item.year} className="flex gap-4 items-start">
                            <span className="bg-gold text-black font-bold px-4 py-2 rounded-btn shrink-0">{item.year}</span>
                            <p className="text-gray-700 pt-2">{item.event}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
