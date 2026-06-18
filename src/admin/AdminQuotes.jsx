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
import { useLocale } from "../hooks/useLocale";

export default function AdminQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [filter, setFilter] = useState("all");
    const { t, dir } = useLocale();

    useEffect(() => {
        const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setQuotes(data);
        });
        return () => unsub();
    }, []);

    const markDone = async (id) => {
        await updateDoc(doc(db, "quotes", id), { done: true });
    };

    const deleteQuote = async (id) => {
        if (!confirm(t("admin.confirmDeleteOrder"))) return;
        await deleteDoc(doc(db, "quotes", id));
    };

    const filtered =
        filter === "all"
            ? quotes
            : quotes.filter((q) => (filter === "done" ? q.done : !q.done));

    const filterLabels = {
        all: t("admin.filterAll"),
        new: t("admin.filterNew"),
        done: t("admin.filterDone"),
    };

    return (
        <div className="flex-1 p-10 bg-gray-50 min-h-screen" dir={dir}>
            <h1 className="text-3xl font-bold mb-6 text-gold">📨 {t("admin.quotesPageTitle")}</h1>

            <div className="flex gap-3 mb-5">
                {["all", "new", "done"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg ${
                            filter === f ? "bg-gold text-black" : "bg-white shadow"
                        }`}
                    >
                        {filterLabels[f]}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-xl p-6">
                {filtered.length === 0 ? (
                    <p className="text-gray-600 text-center">{t("admin.noQuotes")}</p>
                ) : (
                    <table className="w-full text-center border-collapse">
                        <thead>
                        <tr className="bg-gray-100 text-lg">
                            <th className="p-3 border">{t("admin.date")}</th>
                            <th className="p-3 border">{t("admin.name")}</th>
                            <th className="p-3 border">{t("admin.phone")}</th>
                            <th className="p-3 border">{t("admin.city")}</th>
                            <th className="p-3 border">{t("admin.systemCol")}</th>
                            <th className="p-3 border">{t("admin.status")}</th>
                            <th className="p-3 border">{t("admin.actions")}</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.map((q) => (
                            <tr key={q.id} className="border hover:bg-gray-50">
                                <td className="p-3 border">
                                    {q.createdAt?.toDate
                                        ? q.createdAt.toDate().toLocaleString()
                                        : t("admin.loadTypeNone")}
                                </td>
                                <td className="p-3 border">{q.name}</td>
                                <td className="p-3 border">{q.phone}</td>
                                <td className="p-3 border">{q.city}</td>
                                <td className="p-3 border">{q.system}</td>

                                <td className="p-3 border">
                                    {q.done ? (
                                        <span className="text-green-600 font-bold">✔ {t("admin.statusDone")}</span>
                                    ) : (
                                        <span className="text-yellow-600">⏳ {t("admin.statusNew")}</span>
                                    )}
                                </td>

                                <td className="p-3 border flex justify-center gap-2">
                                    {!q.done && (
                                        <button
                                            onClick={() => markDone(q.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            {t("admin.markDone")}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => deleteQuote(q.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        {t("common.delete")}
                                    </button>
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
