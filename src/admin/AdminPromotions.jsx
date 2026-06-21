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
import { BANNER_PLACEMENTS } from "../data/promotions";
import { uploadImageToImgbb } from "../utils/upload";
import { useLocale } from "../hooks/useLocale";

const PLACEMENT_KEYS = {
    home_hero: "admin.placementHomeHero",
    home_mid: "admin.placementHomeMid",
    products_top: "admin.placementProductsTop",
};

export default function AdminPromotions() {
    const { t, dir } = useLocale();
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [placement, setPlacement] = useState("home_hero");
    const [priority, setPriority] = useState("0");
    const [active, setActive] = useState(true);
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "banners"), orderBy("priority", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const resetForm = () => {
        setEditBanner(null);
        setTitle("");
        setSubtitle("");
        setLinkUrl("");
        setLinkText("");
        setPlacement("home_hero");
        setPriority("0");
        setActive(true);
        setStartsAt("");
        setEndsAt("");
        setImageFile(null);
        setUploading(false);
    };

    const startEdit = (b) => {
        setEditBanner(b);
        setTitle(b.title || "");
        setSubtitle(b.subtitle || "");
        setLinkUrl(b.linkUrl || "");
        setLinkText(b.linkText || "");
        setPlacement(b.placement || "home_hero");
        setPriority(String(b.priority ?? 0));
        setActive(b.active !== false);
        setStartsAt(b.startsAt ? formatDateInput(b.startsAt) : "");
        setEndsAt(b.endsAt ? formatDateInput(b.endsAt) : "");
        setImageFile(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = editBanner?.imageUrl || "";
            if (imageFile) {
                imageUrl = await uploadImageToImgbb(imageFile);
            }

            const defaultLinkText = t("common.learnMore");
            const payload = {
                title: title.trim(),
                subtitle: subtitle.trim(),
                linkUrl: linkUrl.trim(),
                linkText: linkText.trim() || defaultLinkText,
                placement,
                priority: Number(priority) || 0,
                active,
                imageUrl,
                startsAt: startsAt ? new Date(startsAt) : null,
                endsAt: endsAt ? new Date(endsAt) : null,
            };

            if (editBanner) {
                await updateDoc(doc(db, "banners", editBanner.id), {
                    ...payload,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await addDoc(collection(db, "banners"), {
                    ...payload,
                    createdAt: serverTimestamp(),
                });
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert(t("admin.saveError"));
            setUploading(false);
        }
    };

    const deleteBanner = async (id) => {
        if (!confirm(t("admin.confirmDeletePromotion"))) return;
        await deleteDoc(doc(db, "banners", id));
    };

    const toggleActive = async (b) => {
        await updateDoc(doc(db, "banners", b.id), { active: !b.active });
    };

    const placementLabel = (id) => t(PLACEMENT_KEYS[id] || id);

    return (
        <div dir={dir}>
            <h1 className="text-3xl font-bold text-gold mb-6">{t("admin.promotionsManage")}</h1>

            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-lg mb-10 space-y-3 w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <h2 className="text-xl font-bold mb-2">
                    {editBanner ? t("admin.editPromotion") : t("admin.addPromotion")}
                </h2>

                <input
                    type="text"
                    placeholder={t("admin.promoTitle")}
                    className="w-full p-3 border rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder={t("admin.promoSubtitle")}
                    className="w-full p-3 border rounded"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={t("admin.promoLinkPlaceholder")}
                    className="w-full p-3 border rounded"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={t("admin.promoLinkText")}
                    className="w-full p-3 border rounded"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                />
                <select
                    className="w-full p-3 border rounded"
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                >
                    {BANNER_PLACEMENTS.map((p) => (
                        <option key={p.id} value={p.id}>{placementLabel(p.id)}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder={t("admin.priorityHint")}
                    className="w-full p-3 border rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                />
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                        <span className="text-sm">{t("admin.startsAt")}</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
                        <span className="text-sm">{t("admin.endsAt")}</span>
                    </label>
                </div>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    <span>{t("common.active")}</span>
                </label>
                <label className="block text-sm text-gray-600">
                    {t("admin.image")}
                    <input
                        type="file"
                        className="w-full p-2 mt-1"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        accept="image/*"
                    />
                </label>
                <button
                    type="submit"
                    className="bg-gray-600 text-white w-full py-2 rounded font-bold disabled:opacity-60"
                    disabled={uploading}
                >
                    {uploading ? t("admin.saving") : t("common.save")}
                </button>
                {editBanner && (
                    <button type="button" className="w-full py-2 rounded font-bold border" onClick={resetForm}>
                        {t("admin.cancelEdit")}
                    </button>
                )}
            </form>

            <div className="grid md:grid-cols-2 gap-6">
                {banners.map((b) => (
                    <div key={b.id} className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="h-40 bg-gray-100 overflow-hidden">
                            {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">{t("admin.noImage")}</div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{b.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                                    {b.active ? t("common.active") : t("common.inactive")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{b.subtitle}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {placementLabel(b.placement)}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <button onClick={() => startEdit(b)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                    {t("common.edit")}
                                </button>
                                <button onClick={() => toggleActive(b)} className="bg-yellow-500 text-black px-3 py-1 rounded text-sm">
                                    {b.active ? t("admin.toggleInactive") : t("admin.toggleActive")}
                                </button>
                                <button onClick={() => deleteBanner(b.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                                    {t("common.delete")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && <p className="text-gray-600">{t("admin.noPromotions")}</p>}
            </div>
        </div>
    );
}

function formatDateInput(ts) {
    const d = ts?.toDate?.() ?? new Date(ts);
    return d.toISOString().slice(0, 10);
}
