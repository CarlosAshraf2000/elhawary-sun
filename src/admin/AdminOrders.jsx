import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { formatPrice } from "../data/productDefaults";
import { useLocale } from "../hooks/useLocale";

function OrderItemsCell({ order }) {
    const [expanded, setExpanded] = useState(false);
    const { t } = useLocale();

    if (order.items?.length) {
        return (
            <div className="text-right text-sm">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="text-gold font-semibold hover:underline"
                >
                    {t("admin.orderItemsSummary", {
                        productCount: order.productCount || order.items.length,
                        itemCount: order.itemCount,
                    })}
                </button>
                {expanded && (
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {order.items.map((item, i) => (
                            <li key={i}>
                                {item.title} × {item.quantity} = {formatPrice(item.price * item.quantity)} {t("admin.currencyShort")}
                            </li>
                        ))}
                    </ul>
                )}
                {order.source === "cart" && (
                    <span className="block mt-1 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded inline-block">
                        {t("admin.cartOrder")}
                    </span>
                )}
            </div>
        );
    }

    return <span>{order.product || t("admin.loadTypeNone")}</span>;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const { t, dir } = useLocale();

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const markDone = async (id) => {
        await updateDoc(doc(db, "orders", id), { done: true, status: "done" });
    };

    const deleteOrder = async (id) => {
        if (!confirm(t("admin.confirmDeleteOrder"))) return;
        await deleteDoc(doc(db, "orders", id));
    };

    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter((o) => (filter === "done" ? o.done === true : o.done !== true));

    const filterLabels = {
        all: t("admin.filterAll"),
        new: t("admin.filterNew"),
        done: t("admin.filterDone"),
    };

    return (
        <div dir={dir}>
            <h1 className="text-3xl font-bold mb-6 text-gold">{t("admin.ordersTitle")}</h1>

            <div className="flex gap-3 mb-5">
                {["all", "new", "done"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg ${filter === f ? "bg-gold text-black" : "bg-white shadow"}`}
                    >
                        {filterLabels[f]}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-xl p-6">
                {filteredOrders.length === 0 ? (
                    <p className="text-gray-600 text-center">{t("admin.noOrders")}</p>
                ) : (
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 border">{t("admin.date")}</th>
                                <th className="p-3 border">{t("admin.productsCol")}</th>
                                <th className="p-3 border">{t("admin.name")}</th>
                                <th className="p-3 border">{t("admin.phone")}</th>
                                <th className="p-3 border">{t("admin.total")}</th>
                                <th className="p-3 border">{t("admin.status")}</th>
                                <th className="p-3 border">{t("admin.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((o) => (
                                <tr key={o.id} className="border hover:bg-gray-50">
                                    <td className="p-3 border text-sm">
                                        {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : t("admin.loadTypeNone")}
                                    </td>
                                    <td className="p-3 border"><OrderItemsCell order={o} /></td>
                                    <td className="p-3 border">{o.name}</td>
                                    <td className="p-3 border" dir="ltr">{o.phone}</td>
                                    <td className="p-3 border font-bold text-gold">
                                        {o.total ? (
                                            <div>
                                                {o.discount > 0 && (
                                                    <span className="block text-xs text-green-600 font-normal">
                                                        {t("admin.discountLabel")}: -{formatPrice(o.discount)} {t("admin.currencyShort")}
                                                        {o.couponCode ? ` (${o.couponCode})` : ""}
                                                    </span>
                                                )}
                                                {formatPrice(o.total)} {t("admin.currencyShort")}
                                            </div>
                                        ) : t("admin.loadTypeNone")}
                                    </td>
                                    <td className="p-3 border">
                                        {o.done ? (
                                            <span className="text-green-600 font-bold">{t("admin.statusDone")}</span>
                                        ) : (
                                            <span className="text-yellow-600">{t("admin.statusNew")}</span>
                                        )}
                                    </td>
                                    <td className="p-3 border">
                                        <div className="flex justify-center gap-2">
                                            {!o.done && (
                                                <button onClick={() => markDone(o.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                                                    {t("admin.markDone")}
                                                </button>
                                            )}
                                            <button onClick={() => deleteOrder(o.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                                {t("common.delete")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
