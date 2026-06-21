import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocale } from "../hooks/useLocale";
import { isShowcaseMode } from "../config/commerce";

async function safeCount(name) {
    try {
        const snap = await getDocs(collection(db, name));
        return snap.size;
    } catch {
        return null;
    }
}

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loadError, setLoadError] = useState("");
    const { t, dir } = useLocale();
    const showcase = isShowcaseMode();

    useEffect(() => {
        (async () => {
            setLoadError("");
            const products = await safeCount("products");
            const quotes = await safeCount("quotes");
            const orders = showcase ? null : await safeCount("orders");

            if (products === null && quotes === null && orders === null) {
                setLoadError(t("admin.statsPermissionError"));
            }

            setStats({
                orders: orders ?? 0,
                products: products ?? 0,
                quotes: quotes ?? 0,
            });
        })();
    }, [t, showcase]);

    if (!stats) return <p className="p-10">{t("common.loading")}</p>;

    return (
        <div dir={dir}>
            <h1 className="text-3xl font-bold mb-6">📊 {t("admin.dashboardStats")}</h1>

            {loadError && (
                <p role="alert" className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                    {loadError}
                </p>
            )}

            <div className={`grid gap-6 ${showcase ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {!showcase && (
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                        <h2 className="text-xl font-bold text-gold">{t("admin.totalOrders")}</h2>
                        <p className="text-4xl mt-2">{stats.orders}</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold text-gold">{t("admin.totalProducts")}</h2>
                    <p className="text-4xl mt-2">{stats.products}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold text-gold">{t("admin.totalQuotes")}</h2>
                    <p className="text-4xl mt-2">{stats.quotes}</p>
                </div>
            </div>
        </div>
    );
}
