import { FaSun, FaTools, FaWater } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageLayout from "../components/ui/PageLayout";
import Button from "../components/ui/Button";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { getLocaleData } from "../i18n";

import solarSystemImg from "../assets/services/solar-system.jpg";
import solarHeaterImg from "../assets/services/solar-water-heater.jpg";
import maintenanceImg from "../assets/services/solar-maintenance.jpg";

const serviceImages = [solarSystemImg, solarHeaterImg, maintenanceImg];
const serviceIcons = [FaSun, FaWater, FaTools];

export default function ServicesPage() {
    const { t, lang } = useLocale();
    const services = getLocaleData(lang).home.services;

    return (
        <PageLayout title={t("services.pageTitle")}>
            <PageMeta titleKey="services.pageTitle" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service, i) => {
                    const Icon = serviceIcons[i];
                    return (
                        <div key={service.title} className="bg-white rounded-card shadow-card overflow-hidden">
                            <img src={serviceImages[i]} alt={service.alt} className="w-full h-56 object-cover" loading="lazy" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon className="text-gold text-2xl" />
                                    <h2 className="text-xl font-bold">{service.title}</h2>
                                </div>
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <Button as={Link} to="/quote">{t("nav.quote")}</Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageLayout>
    );
}
