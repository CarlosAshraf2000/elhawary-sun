import { db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocale } from "../hooks/useLocale";

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const { t, dir } = useLocale();

    useEffect(() => {
        (async () => {
            const ordersCount = await getCountFromServer(collection(db, "orders"));
            const productsCount = await getCountFromServer(collection(db, "products"));
            const quotesCount = await getCountFromServer(collection(db, "quotes"));

            setStats({
                orders: ordersCount.data().count,
                products: productsCount.data().count,
                quotes: quotesCount.data().count,
            });
        })();
    }, []);

    if (!stats) return <p className="p-10">{t("common.loading")}</p>;

    return (
        <div className="p-10" dir={dir}>
            <h1 className="text-3xl font-bold mb-6">📊 {t("admin.dashboardStats")}</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold text-gold">{t("admin.totalOrders")}</h2>
                    <p className="text-4xl mt-2">{stats.orders}</p>
                </div>

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
