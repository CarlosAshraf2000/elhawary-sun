import { FaSun, FaTools, FaWater } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageLayout from "../components/ui/PageLayout";
import Button from "../components/ui/Button";
import Seo from "../components/seo/Seo";
import Card3D from "../components/ui/Card3D";
import GlassPanel from "../components/ui/GlassPanel";
import SiteImage from "../components/ui/SiteImage";
import SectionTitle from "../components/ui/SectionTitle";
import { useLocale } from "../hooks/useLocale";
import { getLocaleData } from "../i18n";

import solarPanelImg from "../assets/products/solar-panel.jpg";
import waterHeaterImg from "../assets/products/water-heater.jpg";
import accessoriesImg from "../assets/products/accessories.jpg";

const serviceImages = [solarPanelImg, waterHeaterImg, accessoriesImg];
const serviceIcons = [FaSun, FaWater, FaTools];

export default function ServicesPage() {
    const { t, lang } = useLocale();
    const services = getLocaleData(lang).home.services;

    return (
        <PageLayout title={t("services.pageTitle")} className="mesh-bg dark:bg-surface">
            <Seo titleKey="services.pageTitle" descriptionKey="seo.defaultDescription" />
            <SectionTitle>{t("services.pageTitle")}</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service, i) => {
                    const Icon = serviceIcons[i];
                    return (
                        <Card3D key={service.title}>
                            <GlassPanel className="overflow-hidden h-full flex flex-col">
                                <SiteImage src={serviceImages[i]} alt={service.alt} variant="card" className="!rounded-none min-h-[220px]" />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Icon className="text-gold text-2xl animate-float" />
                                        <h2 className="text-xl font-bold dark:text-white">{service.title}</h2>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{service.description}</p>
                                    <Button as={Link} to="/quote" className="self-start">{t("nav.quote")}</Button>
                                </div>
                            </GlassPanel>
                        </Card3D>
                    );
                })}
            </div>
        </PageLayout>
    );
}
