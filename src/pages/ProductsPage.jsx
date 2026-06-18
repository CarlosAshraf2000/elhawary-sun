import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import PageLayout from "../components/ui/PageLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import ProductCatalogCard from "../components/products/ProductCatalogCard";
import ProductFiltersSidebar from "../components/products/ProductFiltersSidebar";
import Pagination from "../components/ui/Pagination";
import FloatingShapes from "../components/ui/FloatingShapes";
import PromoCarousel from "../components/promo/PromoCarousel";
import PageMeta from "../components/seo/PageMeta";
import { useLocale } from "../hooks/useLocale";
import { useProductFilters } from "../hooks/useProductFilters";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToast, setAddedToast] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useLocale();

    const { filters, paginated, totalPages, page, applyFilters } = useProductFilters(products);

    useEffect(() => {
        (async () => {
            try {
                const snapshot = await getDocs(collection(db, "products"));
                setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const countries = useMemo(() => {
        const set = new Set(products.map((p) => p.countryOfOrigin).filter(Boolean));
        return [...set].sort();
    }, [products]);

    const showAdded = () => {
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2000);
    };

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
                        {t("shop.storeSubtitle")}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="inline-block bg-gold text-black px-8 py-3 rounded-btn font-bold btn-glow"
                    >
                        {t("shop.viewCart")}
                    </button>
                </div>
            </section>

            <PromoCarousel placement="products_top" className="mesh-bg" />

            <PageLayout className="!py-12">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                    <ProductFiltersSidebar filters={filters} applyFilters={applyFilters} countries={countries} />
                    <div>
                        {loading ? (
                            <LoadingSpinner message={t("shop.loadingProducts")} />
                        ) : paginated.length === 0 ? (
                            <EmptyState message={t("shop.emptyCategory")} />
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                                    {paginated.map((p) => (
                                        <ProductCatalogCard key={p.id} product={p} onAddToCart={showAdded} />
                                    ))}
                                </div>
                                <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
                            </>
                        )}
                    </div>
                </div>
            </PageLayout>

            {addedToast && (
                <div role="status" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-toast text-white px-6 py-3 rounded-btn shadow-glow">
                    {t("common.addedToCart")}
                </div>
            )}
        </div>
    );
}
