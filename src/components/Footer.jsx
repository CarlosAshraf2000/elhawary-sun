import { Link } from "react-router-dom";
import { siteContent } from "../data/siteContent";
import { useLocale } from "../hooks/useLocale";

export default function Footer() {
    const { company, social } = siteContent;
    const { t } = useLocale();

    const quickLinks = [
        ["/about", t("nav.about")],
        ["/services", t("nav.services")],
        ["/projects", t("nav.projects")],
        ["/products", t("nav.products")],
        ["/cart", t("nav.cart")],
        ["/quote", t("nav.quote")],
    ];

    return (
        <footer className="glass-footer relative pt-16 pb-6 overflow-hidden text-white">
            <div className="absolute inset-0 bg-solar-glow opacity-20 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 mb-10 relative z-10 text-white">
                <div>
                    <h3 className="text-xl font-bold text-gold mb-4 text-3d">{t("company.name")}</h3>
                    <p className="text-gray-400 leading-relaxed">{t("company.tagline")}</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gold mb-4">{t("footer.quickLinks")}</h3>
                    <nav className="flex flex-col gap-2">
                        {quickLinks.map(([to, label]) => (
                            <Link key={to} to={to} className="text-gray-400 hover:text-gold transition-all">
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gold mb-4">{t("footer.contactUs")}</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href={`tel:${company.phone}`} className="hover:text-gold transition" dir="ltr">{company.phone}</a></li>
                        <li><a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">{t("footer.whatsapp")}: {company.whatsapp}</a></li>
                        <li><a href={`mailto:${company.email}`} className="hover:text-gold transition">{company.email}</a></li>
                        <li>{t("company.address")}</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-6 text-center text-gray-500 relative z-10">
                <p>{t("footer.copyright", { name: t("company.name"), year: company.year })}</p>
            </div>
        </footer>
    );
}
