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
import { siteContent } from "../data/siteContent";
import { uploadImageToImgbb } from "../utils/upload";
import { useLocale } from "../hooks/useLocale";
import {
    AdminPageHeader,
    AdminForm,
    AdminInput,
    AdminSelect,
    AdminFileInput,
    AdminCheckbox,
    AdminDateInput,
    AdminPrimaryButton,
    AdminSecondaryButton,
} from "./ui/AdminFields";

const PLACEMENT_KEYS = {
    home_hero: "admin.placementHomeHero",
    home_mid: "admin.placementHomeMid",
    products_top: "admin.placementProductsTop",
};

const PLACEMENT_HINTS = {
    home_hero: "admin.placementHomeHeroHint",
    home_mid: "admin.placementHomeMidHint",
    products_top: "admin.placementProductsTopHint",
};

export default function AdminPromotions() {
    const { t, dir } = useLocale();
    const [banners, setBanners] = useState([]);
    const [loadError, setLoadError] = useState("");
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
        const unsub = onSnapshot(
            q,
            (snap) => {
                setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                setLoadError("");
            },
            (err) => {
                console.error(err);
                setLoadError(t("admin.promotionsLoadError"));
            }
        );
        return unsub;
    }, [t]);

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = editBanner?.imageUrl || "";
            if (imageFile) {
                imageUrl = await uploadImageToImgbb(imageFile);
            }

            const defaultLinkText = t("promo.whatsappCta");
            const payload = {
                title: title.trim(),
                subtitle: subtitle.trim(),
                linkUrl: linkUrl.trim() || "whatsapp",
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

            alert(t("admin.promoSaved"));
            resetForm();
        } catch (err) {
            console.error(err);
            alert(t("admin.saveError"));
        } finally {
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
            <AdminPageHeader title={t("admin.promotionsManage")} icon="📢" />

            {loadError && (
                <p role="alert" className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                    {loadError}
                </p>
            )}

            <AdminForm
                title={editBanner ? t("admin.editPromotion") : t("admin.addPromotion")}
                onSubmit={handleSave}
                actions={
                    <>
                        <AdminPrimaryButton disabled={uploading}>
                            {uploading ? t("admin.saving") : t("common.save")}
                        </AdminPrimaryButton>
                        {editBanner && (
                            <AdminSecondaryButton onClick={resetForm}>
                                {t("admin.cancelEdit")}
                            </AdminSecondaryButton>
                        )}
                    </>
                }
            >
                <AdminInput
                    label={t("admin.promoTitle")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder={t("admin.promoTitle")}
                />
                <AdminInput
                    label={t("admin.promoSubtitle")}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder={t("admin.promoSubtitle")}
                />
                <AdminInput
                    label={t("admin.promoLink")}
                    hint={t("admin.promoLinkHint")}
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder={t("admin.promoLinkPlaceholder")}
                />
                <div className="flex flex-wrap items-center gap-2 -mt-2 mb-2">
                    <AdminSecondaryButton
                        type="button"
                        onClick={() => {
                            setLinkUrl("whatsapp");
                            if (!linkText.trim()) setLinkText(t("promo.whatsappCta"));
                        }}
                    >
                        {t("admin.promoUseWhatsApp")}
                    </AdminSecondaryButton>
                    <span className="text-xs text-gray-500" dir="ltr">
                        {siteContent.social.whatsapp}
                    </span>
                </div>
                <AdminInput
                    label={t("admin.promoLinkText")}
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder={t("promo.learnMore")}
                />
                <AdminSelect
                    label={t("admin.placement")}
                    hint={t(PLACEMENT_HINTS[placement])}
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                >
                    {BANNER_PLACEMENTS.map((p) => (
                        <option key={p.id} value={p.id}>{placementLabel(p.id)}</option>
                    ))}
                </AdminSelect>
                <AdminInput
                    label={t("admin.priority")}
                    hint={t("admin.priorityHint")}
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                />
                <AdminDateInput
                    label={t("admin.startsAt")}
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                />
                <AdminDateInput
                    label={t("admin.endsAt")}
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                />
                <AdminCheckbox
                    label={t("common.active")}
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                />
                <AdminFileInput
                    label={t("admin.image")}
                    hint={editBanner ? t("admin.imageOptionalEdit") : t("admin.imageRecommended")}
                    accept="image/*"
                    fileName={imageFile?.name}
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    span={2}
                />
            </AdminForm>

            <div className="grid md:grid-cols-2 gap-6">
                {banners.map((b) => (
                    <div key={b.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="h-44 bg-gray-100 overflow-hidden">
                            {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gold/20 to-gray-200">
                                    {t("admin.noImage")}
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="font-bold text-lg">{b.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                    {b.active ? t("common.active") : t("common.inactive")}
                                </span>
                            </div>
                            {b.subtitle && <p className="text-sm text-gray-600">{b.subtitle}</p>}
                            <p className="text-xs text-gold font-semibold mt-2">{placementLabel(b.placement)}</p>
                            {b.linkUrl && (
                                <p className="text-xs text-gray-500 mt-1 truncate" dir="ltr">{b.linkUrl}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button type="button" onClick={() => startEdit(b)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                                    {t("common.edit")}
                                </button>
                                <button type="button" onClick={() => toggleActive(b)} className="bg-amber-400 hover:bg-amber-500 text-black px-3 py-1.5 rounded-lg text-sm font-semibold">
                                    {b.active ? t("admin.toggleInactive") : t("admin.toggleActive")}
                                </button>
                                <button type="button" onClick={() => deleteBanner(b.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                                    {t("common.delete")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && !loadError && (
                    <p className="text-gray-600 md:col-span-2">{t("admin.noPromotions")}</p>
                )}
            </div>
        </div>
    );
}

function formatDateInput(ts) {
    const d = ts?.toDate?.() ?? new Date(ts);
    return d.toISOString().slice(0, 10);
}
