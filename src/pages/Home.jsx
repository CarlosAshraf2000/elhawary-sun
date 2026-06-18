import Hero from "../components/Hero.jsx";
import Services from "../components/Services.jsx";
import StatsBar, { WhyChooseUs, Testimonials, CTABanner } from "../components/home/StatsBar.jsx";
import FeaturedProjects from "../components/home/FeaturedProjects.jsx";
import PromoCarousel from "../components/promo/PromoCarousel.jsx";

export default function Home() {
    return (
        <>
            <Hero />
            <PromoCarousel placement="home_hero" />
            <Services />
            <StatsBar />
            <WhyChooseUs />
            <PromoCarousel placement="home_mid" />
            <FeaturedProjects />
            <Testimonials />
            <CTABanner />
        </>
    );
}
