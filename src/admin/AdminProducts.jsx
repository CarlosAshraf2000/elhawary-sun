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
            <h1 className="text-3xl font-bold text-gold mb-6">{t("admin.productsManage")}</h1>

            <form
                onSubmit={handleSave}
                className="bg-white p-6 rounded-xl shadow-lg mb-10 space-y-3 w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <h2 className="text-xl font-bold mb-2">
                    {editProduct ? t("admin.editProduct") : t("admin.addProduct")}
                </h2>

                <input
                    type="text"
                    placeholder={t("admin.productName")}
                    className="w-full p-3 border rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder={t("admin.brand")}
                    className="w-full p-3 border rounded"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                />

                <input
                    type="text"
                    placeholder={t("admin.model")}
                    className="w-full p-3 border rounded"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />

                <input
                    type="number"
                    placeholder={t("admin.price")}
                    className="w-full p-3 border rounded"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder={t("admin.requestPrice")}
                    className="w-full p-3 border rounded"
                    value={requestPrice}
                    onChange={(e) => setRequestPrice(e.target.value)}
                />

                <input
                    type="number"
                    placeholder={t("admin.salePrice")}
                    className="w-full p-3 border rounded"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                />

                <label className="block text-sm text-gray-600">
                    {t("admin.promoEnds")}
                    <input
                        type="date"
                        className="w-full p-3 border rounded mt-1"
                        value={promoEndsAt}
                        onChange={(e) => setPromoEndsAt(e.target.value)}
                    />
                </label>

                <label className="block text-sm text-gray-600">
                    {t("admin.category")}
                    <select
                        className="w-full p-3 border rounded mt-1"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {CATEGORY_IDS.map((id) => (
                            <option key={id} value={id}>{t(`categories.${id}`)}</option>
                        ))}
                    </select>
                </label>

                <input
                    type="number"
                    placeholder={t("admin.stock")}
                    className="w-full p-3 border rounded"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />

                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} />
                    <span>{t("admin.soldOut")}</span>
                </label>

                <input
                    type="number"
                    placeholder={t("admin.powerKw")}
                    className="w-full p-3 border rounded"
                    value={powerKw}
                    onChange={(e) => setPowerKw(e.target.value)}
                />

                <input
                    type="number"
                    placeholder={t("admin.powerKva")}
                    className="w-full p-3 border rounded"
                    value={powerKva}
                    onChange={(e) => setPowerKva(e.target.value)}
                />

                <label className="block text-sm text-gray-600">
                    {t("admin.loadType")}
                    <select
                        className="w-full p-3 border rounded mt-1"
                        value={loadType}
                        onChange={(e) => setLoadType(e.target.value)}
                    >
                        <option value="">{t("admin.loadTypeNone")}</option>
                        <option value="single">{t("shop.loadSingle")}</option>
                        <option value="three">{t("shop.loadThree")}</option>
                    </select>
                </label>

                <input
                    type="text"
                    placeholder={t("admin.country")}
                    className="w-full p-3 border rounded"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                />

                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                    <span>{t("admin.featured")}</span>
                </label>

                <textarea
                    placeholder={t("admin.description")}
                    className="w-full p-3 border rounded"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    required
                />

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
                    className="bg-gray-600 text-white w-full py-2 rounded font-bold disabled:opacity-60"
                    disabled={uploading}
                >
                    {uploading ? t("admin.uploadingSaving") : t("common.save")}
                </button>

                {editProduct && (
                    <button type="button" className="w-full py-2 rounded font-bold border mt-2" onClick={resetForm}>
                        {t("admin.cancelEdit")}
                    </button>
                )}
            </form>

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
