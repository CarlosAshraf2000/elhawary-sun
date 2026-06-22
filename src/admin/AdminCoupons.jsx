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
import {
    AdminPageHeader,
    AdminForm,
    AdminInput,
    AdminSelect,
    AdminCheckbox,
    AdminDateInput,
    AdminPrimaryButton,
} from "./ui/AdminFields";

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
        alert(t("admin.addCoupon"));
    };

    const toggleActive = async (c) => {
        await updateDoc(doc(db, "coupons", c.id), { active: !c.active });
    };

    const deleteCoupon = async (id) => {
        if (!confirm(t("admin.confirmDeleteCoupon"))) return;
        await deleteDoc(doc(db, "coupons", id));
    };

    return (
        <div dir={dir}>
            <AdminPageHeader title={t("admin.couponsManage")} icon="🎟️" />

            <AdminForm
                title={t("admin.addCoupon")}
                onSubmit={handleSave}
                actions={<AdminPrimaryButton>{t("admin.addCoupon")}</AdminPrimaryButton>}
            >
                <AdminInput
                    label={t("admin.code")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="uppercase"
                    required
                    placeholder={t("admin.codePlaceholder")}
                />
                <AdminSelect label={t("admin.type")} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="percent">{t("admin.percentOption")}</option>
                    <option value="fixed">{t("admin.fixedOption")}</option>
                </AdminSelect>
                <AdminInput
                    label={type === "percent" ? t("admin.valuePercent") : t("admin.valueFixed")}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
                <AdminInput
                    label={t("admin.minOrder")}
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                />
                <AdminInput
                    label={t("admin.maxUses")}
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                />
                <AdminDateInput
                    label={t("admin.expiresAt")}
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                />
                <AdminCheckbox
                    label={t("common.active")}
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                />
            </AdminForm>

            <div className="overflow-x-auto bg-white shadow-md border border-gray-100 rounded-2xl p-6">
                {coupons.length === 0 ? (
                    <p className="text-gray-600 text-center">{t("admin.noCoupons")}</p>
                ) : (
                    <table className="w-full text-center border-collapse min-w-[640px]">
                        <thead>
                            <tr className="bg-gray-50 text-base">
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
                                <tr key={c.id} className="hover:bg-gray-50/80">
                                    <td className="p-3 border font-mono font-bold">{c.code}</td>
                                    <td className="p-3 border">{c.type === "percent" ? "%" : t("admin.currencyShort")}</td>
                                    <td className="p-3 border">{c.value}</td>
                                    <td className="p-3 border">{c.usedCount ?? 0}{c.maxUses != null ? ` / ${c.maxUses}` : ""}</td>
                                    <td className="p-3 border">
                                        <span className={`text-xs px-2 py-1 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                                            {c.active ? t("common.active") : t("common.inactive")}
                                        </span>
                                    </td>
                                    <td className="p-3 border">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <button type="button" onClick={() => toggleActive(c)} className="bg-amber-400 text-black px-3 py-1 rounded-lg text-sm font-semibold">
                                                {c.active ? t("admin.toggleInactive") : t("admin.toggleActive")}
                                            </button>
                                            <button type="button" onClick={() => deleteCoupon(c.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
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
