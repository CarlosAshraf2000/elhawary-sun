import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useBanners } from "../../hooks/usePromotions";
import SiteImage from "../ui/SiteImage";
import GlassPanel from "../ui/GlassPanel";
import { defaultProduct } from "../../data/productDefaults";
import { useLocale } from "../../hooks/useLocale";
import "swiper/css";
import "swiper/css/pagination";

export default function PromoCarousel({ placement, className = "" }) {
    const { banners, loading } = useBanners(placement);
    const { t, dir } = useLocale();

    if (loading || banners.length === 0) return null;

    return (
        <section className={`py-8 ${className}`} dir={dir} aria-label={t("promo.sectionLabel")}>
            <div className="max-w-7xl mx-auto px-6">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    loop={banners.length > 1}
                    className="promo-swiper rounded-card overflow-hidden"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <GlassPanel className="overflow-hidden">
                                <div className="relative">
                                    {banner.imageUrl ? (
                                        <SiteImage src={banner.imageUrl} alt={banner.title || t("promo.defaultAlt")} variant="banner" gradient fallback={defaultProduct} />
                                    ) : (
                                        <div className="aspect-[21/9] md:aspect-[3/1] bg-gradient-to-l from-gold/30 to-dark/80" />
                                    )}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
                                        {banner.title && <h2 className="text-2xl md:text-4xl font-bold text-3d mb-2">{banner.title}</h2>}
                                        {banner.subtitle && <p className="text-lg md:text-xl opacity-95 mb-4 max-w-2xl">{banner.subtitle}</p>}
                                        {banner.linkUrl && (
                                            <Link to={banner.linkUrl} className="inline-block self-start bg-gold text-black px-6 py-3 rounded-btn font-bold btn-glow">
                                                {banner.linkText || t("promo.learnMore")}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </GlassPanel>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
