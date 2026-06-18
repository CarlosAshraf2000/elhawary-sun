import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { useLocale } from "../hooks/useLocale";

export default function AdminCoupons() {
    const { t, dir } = useLocale();
    const [coupons, setCoupons] = useState([]);
    const [code, setCode] = useState("");
    const [type, setType] = useState("percent");
    const [value, setValue] = useState("");
    const [minOrder, setMinOrder] = useState("");
    const [maxUses, setMaxUses] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [active, setActive] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "coupons"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setCoupons(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const resetForm = () => {
        setCode("");
        setType("percent");
        setValue("");
        setMinOrder("");
        setMaxUses("");
        setExpiresAt("");
        setActive(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!code.trim() || !value) {
            alert(t("admin.fillCodeValue"));
            return;
        }

        await addDoc(collection(db, "coupons"), {
            code: code.trim().toUpperCase(),
            type,
            value: Number(value),
            minOrder: minOrder ? Number(minOrder) : null,
            maxUses: maxUses ? Number(maxUses) : null,
            usedCount: 0,
            active,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdAt: serverTimestamp(),
        });
        resetForm();
    };

    const toggleActive = async (c) => {
        await updateDoc(doc(db, "coupons", c.id), { active: !c.active });
    };

    const deleteCoupon = async (id) => {
        if (!confirm(t("admin.confirmDeleteCoupon"))) return;
        await deleteDoc(doc(db, "coupons", id));
    };

    return (
        <div className="p-6" dir={dir}>
            <h1 className="text-3xl font-bold text-gold mb-6">{t("admin.couponsManage")}</h1>

            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-lg mb-10 space-y-3 max-w-md ml-auto">
                <h2 className="text-xl font-bold mb-2">{t("admin.addCoupon")}</h2>
                <input
                    type="text"
                    placeholder={t("admin.codePlaceholder")}
                    className="w-full p-3 border rounded uppercase"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <select className="w-full p-3 border rounded" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="percent">{t("admin.percentOption")}</option>
                    <option value="fixed">{t("admin.fixedOption")}</option>
                </select>
                <input
                    type="number"
                    placeholder={type === "percent" ? t("admin.valuePercent") : t("admin.valueFixed")}
                    className="w-full p-3 border rounded"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder={t("admin.minOrder")}
                    className="w-full p-3 border rounded"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                />
                <input
                    type="number"
                    placeholder={t("admin.maxUses")}
                    className="w-full p-3 border rounded"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                />
                <label className="block text-sm">
                    {t("admin.expiresAt")}
                    <input
                        type="date"
                        className="w-full p-3 border rounded mt-1"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                    />
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    <span>{t("common.active")}</span>
                </label>
                <button type="submit" className="bg-gray-600 text-white w-full py-2 rounded font-bold">
                    {t("admin.addCodeBtn")}
                </button>
            </form>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border">{t("admin.code")}</th>
                            <th className="p-3 border">{t("admin.type")}</th>
                            <th className="p-3 border">{t("admin.value")}</th>
                            <th className="p-3 border">{t("admin.usage")}</th>
                            <th className="p-3 border">{t("admin.status")}</th>
                            <th className="p-3 border">{t("admin.actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((c) => (
                            <tr key={c.id} className="border-b">
                                <td className="p-3 font-mono font-bold">{c.code}</td>
                                <td className="p-3">{c.type === "percent" ? t("admin.percent") : t("admin.fixed")}</td>
                                <td className="p-3">
                                    {c.type === "percent" ? `${c.value}%` : `${c.value} ${t("admin.currencyShort")}`}
                                </td>
                                <td className="p-3">{c.usedCount ?? 0}{c.maxUses != null ? ` / ${c.maxUses}` : ""}</td>
                                <td className="p-3">
                                    <span className={c.active ? "text-green-600" : "text-gray-500"}>
                                        {c.active ? t("common.active") : t("common.inactive")}
                                    </span>
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button onClick={() => toggleActive(c)} className="bg-yellow-500 text-black px-2 py-1 rounded text-sm">
                                        {c.active ? t("admin.toggleInactive") : t("admin.toggleActive")}
                                    </button>
                                    <button onClick={() => deleteCoupon(c.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                                        {t("common.delete")}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && <p className="p-6 text-gray-600 text-center">{t("admin.noCoupons")}</p>}
            </div>
        </div>
    );
}
