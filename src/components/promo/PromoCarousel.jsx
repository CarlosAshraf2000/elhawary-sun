import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useBanners } from "../../hooks/usePromotions";
import SiteImage from "../ui/SiteImage";
import { defaultProduct } from "../../data/productDefaults";
import { resolveBannerLink, isWhatsAppLink } from "../../data/promotions";
import { useLocale } from "../../hooks/useLocale";
import { isExternalLink, isSafeBannerLink } from "../../utils/validation";
import "swiper/css";
import "swiper/css/pagination";

function BannerSlide({ banner, t }) {
    const href = resolveBannerLink(banner.linkUrl);
    const external = isExternalLink(href);
    const safe = isSafeBannerLink(href);
    const label =
        banner.linkText ||
        (isWhatsAppLink(href) ? t("promo.whatsappCta") : t("promo.learnMore"));
    const ariaLabel = [banner.title, banner.subtitle, label].filter(Boolean).join(" — ");

    const content = (
        <div className="relative overflow-hidden rounded-card bg-gray-900">
            {banner.imageUrl ? (
                <SiteImage
                    src={banner.imageUrl}
                    alt={banner.title || t("promo.defaultAlt")}
                    variant="banner"
                    gradient
                    fallback={defaultProduct}
                />
            ) : (
                <div className="aspect-[21/9] md:aspect-[3/1] bg-gradient-to-l from-gold/30 to-dark/80" />
            )}

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
                    aria-hidden
                />
                <div className="relative z-10 text-white">
                    {banner.title ? (
                        <h2 className="text-2xl md:text-4xl font-bold text-3d mb-2 drop-shadow-lg">
                            {banner.title}
                        </h2>
                    ) : null}
                    {banner.subtitle ? (
                        <p className="text-base md:text-xl opacity-95 mb-4 max-w-2xl drop-shadow-md">
                            {banner.subtitle}
                        </p>
                    ) : null}
                    {safe ? (
                        <span className="inline-flex items-center gap-2 self-start bg-gold text-black px-6 py-3 rounded-btn font-bold btn-glow shadow-lg">
                            {isWhatsAppLink(href) ? (
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .92.92l4.458-1.495A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 0 1-4.95-1.35l-.355-.21-2.64.886.886-2.574-.231-.375A9.75 9.75 0 1 1 12 21.75z" />
                                </svg>
                            ) : null}
                            {label}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );

    if (!safe) return content;

    const linkClass =
        "block rounded-card overflow-hidden transition-transform duration-300 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label={ariaLabel || label}
            >
                {content}
            </a>
        );
    }

    return (
        <Link to={href} className={linkClass} aria-label={ariaLabel || label}>
            {content}
        </Link>
    );
}

export default function PromoCarousel({ placement, className = "" }) {
    const { banners, loading } = useBanners(placement);
    const { t, dir } = useLocale();
    const swiperRef = useRef(null);

    const count = banners.length;
    const canRotate = count > 1;
    const swiperKey = `${placement}-${banners.map((b) => b.id).join("-")}`;

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper?.autoplay || !canRotate) return;
        if (!swiper.autoplay.running) {
            swiper.autoplay.start();
        }
    }, [swiperKey, canRotate]);

    if (loading || banners.length === 0) return null;

    return (
        <section className={`py-8 ${className}`} dir={dir} aria-label={t("promo.sectionLabel")}>
            <div className="max-w-7xl mx-auto px-6">
                <Swiper
                    key={swiperKey}
                    dir={dir}
                    modules={[Pagination, Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1}
                    spaceBetween={0}
                    speed={700}
                    observer
                    observeParents
                    rewind={canRotate}
                    pagination={{ clickable: true, dynamicBullets: canRotate }}
                    autoplay={
                        canRotate
                            ? {
                                  delay: 5000,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true,
                                  stopOnLastSlide: false,
                              }
                            : false
                    }
                    className="promo-swiper rounded-card overflow-hidden"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <BannerSlide banner={banner} t={t} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
