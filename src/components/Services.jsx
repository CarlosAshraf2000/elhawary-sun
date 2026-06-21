import { Link } from "react-router-dom";
import { FaSun, FaTools, FaWater } from "react-icons/fa";
import SectionTitle from "./ui/SectionTitle";
import Card3D from "./ui/Card3D";
import GlassPanel from "./ui/GlassPanel";
import { useLocale } from "../hooks/useLocale";
import { getLocaleData } from "../i18n";

import solarPanelImg from "../assets/products/solar-panel.jpg";
import waterHeaterImg from "../assets/products/water-heater.jpg";
import accessoriesImg from "../assets/products/accessories.jpg";

const serviceImages = [solarPanelImg, waterHeaterImg, accessoriesImg];
const serviceIcons = [FaSun, FaWater, FaTools];

export default function Services() {
    const { lang, t } = useLocale();
    const services = getLocaleData(lang).home.services;

    return (
        <section className="py-20 mesh-bg">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle>{t("home.servicesTitle")}</SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, i) => {
                        const Icon = serviceIcons[i];
                        return (
                            <Card3D key={service.title} className={`animate-fade-up stagger-${i + 1}`}>
                                <GlassPanel className="overflow-hidden h-full flex flex-col">
                                    <img src={serviceImages[i]} alt={service.alt} className="h-56 w-full object-cover product-image-3d" loading="lazy" />
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Icon className="text-gold text-2xl animate-float" />
                                            <h3 className="text-xl font-bold">{service.title}</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 flex-1">{service.description}</p>
                                        <Link to="/services" className="text-gold font-semibold hover:underline">{t("common.learnMore")}</Link>
                                    </div>
                                </GlassPanel>
                            </Card3D>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
