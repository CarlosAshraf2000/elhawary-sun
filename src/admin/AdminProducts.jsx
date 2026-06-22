import { useEffect, useState } from "react";
import { db } from "../firebase.js";
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
import { CATEGORY_IDS, getProductImage, isOnSale, getCategoryLabel } from "../data/productDefaults";
import { uploadImageToImgbb } from "../utils/upload";
import { useLocale } from "../hooks/useLocale";
import {
    AdminPageHeader,
    AdminForm,
    AdminInput,
    AdminTextarea,
    AdminSelect,
    AdminFileInput,
    AdminCheckbox,
    AdminDateInput,
    AdminPrimaryButton,
    AdminSecondaryButton,
} from "./ui/AdminFields";

export default function AdminProducts() {
    const { t, dir } = useLocale();
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [promoEndsAt, setPromoEndsAt] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("panels");
    const [featured, setFeatured] = useState(false);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [requestPrice, setRequestPrice] = useState("");
    const [stock, setStock] = useState("");
    const [soldOut, setSoldOut] = useState(false);
    const [powerKw, setPowerKw] = useState("");
    const [powerKva, setPowerKva] = useState("");
    const [loadType, setLoadType] = useState("");
    const [countryOfOrigin, setCountryOfOrigin] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    const resetForm = () => {
        setEditProduct(null);
        setTitle("");
        setPrice("");
        setSalePrice("");
        setPromoEndsAt("");
        setDesc("");
        setCategory("panels");
        setFeatured(false);
        setBrand("");
        setModel("");
        setRequestPrice("");
        setStock("");
        setSoldOut(false);
        setPowerKw("");
        setPowerKva("");
        setLoadType("");
        setCountryOfOrigin("");
        setImageFile(null);
        setUploading(false);
    };

    const startEdit = (p) => {
        setEditProduct(p);
        setTitle(p.title || "");
        setPrice(String(p.price ?? ""));
        setSalePrice(p.salePrice != null ? String(p.salePrice) : "");
        setPromoEndsAt(p.promoEndsAt ? formatDateInput(p.promoEndsAt) : "");
        setDesc(p.description || "");
        setCategory(p.category || "panels");
        setFeatured(!!p.featured);
        setBrand(p.brand || "");
        setModel(p.model || "");
        setRequestPrice(p.requestPrice != null ? String(p.requestPrice) : "");
        setStock(p.stock != null ? String(p.stock) : "");
        setSoldOut(!!p.soldOut);
        setPowerKw(p.powerKw != null ? String(p.powerKw) : "");
        setPowerKva(p.powerKva != null ? String(p.powerKva) : "");
        setLoadType(p.loadType || "");
        setCountryOfOrigin(p.countryOfOrigin || "");
        setImageFile(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = editProduct?.imageUrl || "";
            if (imageFile) {
                imageUrl = await uploadImageToImgbb(imageFile);
            }

            const payload = {
                title: title.trim(),
                price: Number(price) || 0,
                description: desc.trim(),
                category,
                featured,
                imageUrl: imageUrl || editProduct?.imageUrl || "",
                salePrice: salePrice ? Number(salePrice) : null,
                promoEndsAt: promoEndsAt ? new Date(promoEndsAt) : null,
                brand: brand.trim(),
                model: model.trim(),
                requestPrice: requestPrice !== "" ? Number(requestPrice) : null,
                stock: stock !== "" ? Number(stock) : null,
                soldOut,
                powerKw: powerKw !== "" ? Number(powerKw) : null,
                powerKva: powerKva !== "" ? Number(powerKva) : null,
                loadType: loadType || null,
                countryOfOrigin: countryOfOrigin.trim(),
            };

            if (editProduct) {
                await updateDoc(doc(db, "products", editProduct.id), {
                    ...payload,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await addDoc(collection(db, "products"), {
                    ...payload,
                    imageUrl: imageUrl || "",
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

    const deleteProduct = async (id) => {
        if (!confirm(t("admin.confirmDeleteProduct"))) return;
        await deleteDoc(doc(db, "products", id));
    };

    return (
        <div dir={dir}>
            <AdminPageHeader title={t("admin.productsManage")} icon="📦" />

            <AdminForm
                title={editProduct ? t("admin.editProduct") : t("admin.addProduct")}
                onSubmit={handleSave}
                actions={
                    <>
                        <AdminPrimaryButton disabled={uploading}>
                            {uploading ? t("admin.uploadingSaving") : t("common.save")}
                        </AdminPrimaryButton>
                        {editProduct && (
                            <AdminSecondaryButton onClick={resetForm}>
                                {t("admin.cancelEdit")}
                            </AdminSecondaryButton>
                        )}
                    </>
                }
            >
                <AdminInput label={t("admin.productName")} value={title} onChange={(e) => setTitle(e.target.value)} required />
                <AdminInput label={t("admin.brand")} value={brand} onChange={(e) => setBrand(e.target.value)} />
                <AdminInput label={t("admin.model")} value={model} onChange={(e) => setModel(e.target.value)} />
                <AdminInput label={t("admin.price")} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <AdminInput label={t("admin.requestPrice")} type="number" value={requestPrice} onChange={(e) => setRequestPrice(e.target.value)} />
                <AdminInput label={t("admin.salePrice")} type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                <AdminDateInput label={t("admin.promoEnds")} value={promoEndsAt} onChange={(e) => setPromoEndsAt(e.target.value)} />
                <AdminSelect label={t("admin.category")} value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORY_IDS.map((id) => (
                        <option key={id} value={id}>{t(`categories.${id}`)}</option>
                    ))}
                </AdminSelect>
                <AdminInput label={t("admin.stock")} type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                <AdminCheckbox label={t("admin.soldOut")} checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} />
                <AdminInput label={t("admin.powerKw")} type="number" value={powerKw} onChange={(e) => setPowerKw(e.target.value)} />
                <AdminInput label={t("admin.powerKva")} type="number" value={powerKva} onChange={(e) => setPowerKva(e.target.value)} />
                <AdminSelect label={t("admin.loadType")} value={loadType} onChange={(e) => setLoadType(e.target.value)}>
                    <option value="">{t("admin.loadTypeNone")}</option>
                    <option value="single">{t("shop.loadSingle")}</option>
                    <option value="three">{t("shop.loadThree")}</option>
                </AdminSelect>
                <AdminInput label={t("admin.country")} value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} />
                <AdminCheckbox label={t("admin.featured")} checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <AdminTextarea label={t("admin.description")} value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} span={2} required />
                <AdminFileInput
                    label={t("admin.image")}
                    accept="image/*"
                    fileName={imageFile?.name}
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    span={2}
                />
            </AdminForm>

            <div className="grid md:grid-cols-2 gap-8">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="h-64 bg-gray-100 overflow-hidden">
                            <img src={getProductImage(p)} alt={p.title} className="w-full h-64 object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold">{p.title}</h3>
                            <p className="text-gray-600 line-clamp-2">{p.description}</p>
                            <p className="text-gold font-bold mt-2">
                                {isOnSale(p) ? (
                                    <>
                                        <span className="line-through text-gray-400 text-sm ml-1">{p.price}</span>
                                        {p.salePrice} {t("admin.currencyShort")}
                                    </>
                                ) : (
                                    <>{p.price} {t("admin.currencyShort")}</>
                                )}
                            </p>
                            {p.featured && (
                                <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded ml-1">
                                    {t("admin.featuredBadge")}
                                </span>
                            )}
                            {p.category && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {getCategoryLabel(p.category, t)}
                                </span>
                            )}
                            <div className="flex justify-between mt-3">
                                <button onClick={() => startEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded">
                                    {t("common.edit")}
                                </button>
                                <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                    {t("common.delete")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {products.length === 0 && <p className="text-gray-600">{t("admin.noProducts")}</p>}
            </div>
        </div>
    );
}

function formatDateInput(ts) {
    const d = ts?.toDate?.() ?? new Date(ts);
    return d.toISOString().slice(0, 10);
}
