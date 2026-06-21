import { Link } from "react-router-dom";
import heroImg from "../assets/hero2.jpg";
import FloatingShapes from "./ui/FloatingShapes";
import Button from "./ui/Button";
import SiteImage from "./ui/SiteImage";
import HeroSolar3D from "./hero/HeroSolar3D";
import { useLocale } from "../hooks/useLocale";

export default function Hero() {
    const { t } = useLocale();
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
        <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden perspective-scene">
            <SiteImage src={heroImg} alt={t("home.heroImgAlt")} variant="hero" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
            {!reduceMotion && <HeroSolar3D />}
            <FloatingShapes />

            <div className="relative z-10 px-4 max-w-4xl animate-fade-up">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-3d">
                    {t("home.heroTitle")}
                </h1>
                <p className="text-lg sm:text-xl md:text-3xl mb-10 opacity-95 drop-shadow-md max-w-2xl mx-auto">
                    {t("home.heroSubtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button as={Link} to="/quote" size="lg" className="btn-glow shadow-glow w-full sm:w-auto">
                        {t("home.heroCtaQuote")}
                    </Button>
                    <Button as={Link} to="/products" variant="outline" size="lg" className="glass-btn-light border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">
                        {t("home.heroCtaShop")}
                    </Button>
                </div>
            </div>
        </section>
    );
}
