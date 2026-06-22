import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import StatsBar, { WhyChooseUs, Testimonials, CTABanner } from "../components/home/StatsBar.jsx";
import FeaturedProjects from "../components/home/FeaturedProjects.jsx";
import PromoCarousel from "../components/promo/PromoCarousel.jsx";
import QuietErrorBoundary from "../components/ui/QuietErrorBoundary.jsx";
import Seo from "../components/seo/Seo.jsx";

export default function Home() {
    return (
        <>
            <Seo titleKey="seo.titleHome" descriptionKey="seo.defaultDescription" />
            <Hero />
            <QuietErrorBoundary>
                <PromoCarousel placement="home_hero" />
            </QuietErrorBoundary>
            <Services />
            <StatsBar />
            <WhyChooseUs />
            <QuietErrorBoundary>
                <PromoCarousel placement="home_mid" />
            </QuietErrorBoundary>
            <FeaturedProjects />
            <Testimonials />
            <CTABanner />
        </>
    );
}
