import { useState, useEffect, useMemo } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";

import { db } from "../firebase";

import { collection, getDocs } from "firebase/firestore";

import { siteContent } from "../data/siteContent";

import PageLayout from "../components/ui/PageLayout";

import LoadingSpinner from "../components/ui/LoadingSpinner";

import EmptyState from "../components/ui/EmptyState";

import ProductCatalogCard from "../components/products/ProductCatalogCard";

import ProductFiltersSidebar from "../components/products/ProductFiltersSidebar";

import Pagination from "../components/ui/Pagination";

import FloatingShapes from "../components/ui/FloatingShapes";

import PromoCarousel from "../components/promo/PromoCarousel";
import QuietErrorBoundary from "../components/ui/QuietErrorBoundary";

import PageMeta from "../components/seo/PageMeta";

import { useLocale } from "../hooks/useLocale";

import { useProductFilters } from "../hooks/useProductFilters";



export default function ProductsPage() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadError, setLoadError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const { t } = useLocale();



    const { filters, paginated, totalPages, page, applyFilters } = useProductFilters(products);



    useEffect(() => {

        (async () => {

            try {

                const snapshot = await getDocs(collection(db, "products"));

                setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

                setLoadError("");

            } catch {

                setLoadError(t("common.loadError"));

                setProducts([]);

            } finally {

                setLoading(false);

            }

        })();

    }, [t]);



    const countries = useMemo(() => {

        const set = new Set(products.map((p) => p.countryOfOrigin).filter(Boolean));

        return [...set].sort();

    }, [products]);



    const onPageChange = (p) => {

        const next = new URLSearchParams(searchParams);

        next.set("page", String(p));

        setSearchParams(next);

    };



    return (

        <div>

            <PageMeta titleKey="shop.storeTitle" descriptionKey="seo.defaultDescription" />

            <section className="relative py-20 mesh-bg overflow-hidden">

                <FloatingShapes />

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

                    <h1 className="text-4xl md:text-5xl font-extrabold text-3d text-dark mb-4">

                        {t("shop.storeTitle")}

                    </h1>

                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">

                        {t("shop.storeSubtitleShowcase")}

                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

                        <a

                            href={siteContent.social.whatsapp}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-btn font-bold btn-glow"

                        >

                            <FaWhatsapp />

                            {t("shop.contactWhatsapp")}

                        </a>

                        <Link

                            to="/quote"

                            className="inline-block bg-gold text-black px-8 py-3 rounded-btn font-bold btn-glow"

                        >

                            {t("nav.quote")}

                        </Link>

                    </div>

                </div>

            </section>



            <QuietErrorBoundary>
                <PromoCarousel placement="products_top" className="mesh-bg" />
            </QuietErrorBoundary>



            <PageLayout className="!py-12">

                <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                    <ProductFiltersSidebar filters={filters} applyFilters={applyFilters} countries={countries} />

                    <div>

                        {loading ? (

                            <LoadingSpinner message={t("shop.loadingProducts")} />

                        ) : loadError ? (

                            <EmptyState message={loadError} />

                        ) : paginated.length === 0 ? (

                            <EmptyState message={t("shop.emptyCategory")} />

                        ) : (

                            <>

                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">

                                    {paginated.map((p) => (

                                        <ProductCatalogCard key={p.id} product={p} />

                                    ))}

                                </div>

                                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />

                            </>

                        )}

                    </div>

                </div>

            </PageLayout>

        </div>

    );

}


