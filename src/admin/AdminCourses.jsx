import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { resolveCoursePdfUrl, uploadImageToImgbb } from "../utils/upload.js";
import { normalizePdfUrl } from "../utils/validation.js";
import { useLocale } from "../hooks/useLocale";
import {
    AdminPageHeader,
    AdminForm,
    AdminInput,
    AdminTextarea,
    AdminFileInput,
    AdminPrimaryButton,
} from "./ui/AdminFields";

function getUploadErrorKey(err) {
    const code = err?.message || err?.code || "";
    if (code === "VITE_IMGBB_KEY is not set") return "admin.errors.imgbbMissing";
    if (code === "IMAGE_UPLOAD_FAILED") return "admin.errors.imageUploadFailed";
    if (code === "PDF_MISSING") return "admin.errors.pdfMissing";
    if (code === "PDF_ONLY") return "admin.errors.pdfOnly";
    if (code === "PDF_TOO_LARGE") return "admin.errors.pdfTooLarge";
    if (code === "CLOUDINARY_NOT_CONFIGURED") return "admin.errors.cloudinaryNotConfigured";
    if (code === "PDF_URL_EMPTY" || code === "PDF_URL_INVALID") return "admin.errors.pdfUrlInvalid";
    if (code === "PDF_UPLOAD_FAILED" || String(code).includes("Upload preset")) {
        return "admin.errors.pdfUploadFailed";
    }
    return "admin.saveError";
}

export default function AdminCourses() {
    const { t, dir } = useLocale();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrlInput, setPdfUrlInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setCourses(data);
            },
            (err) => console.error(err)
        );
        return () => unsub();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !desc.trim() || !imageFile || (!pdfFile && !pdfUrlInput.trim())) {
            return alert(t("admin.fillAllCourseData"));
        }

        setUploading(true);
        try {
            const imageURL = await uploadImageToImgbb(imageFile);
            const pdfURL = await resolveCoursePdfUrl({
                file: pdfFile,
                urlInput: pdfUrlInput,
                normalizePdfUrl,
            });

            await addDoc(collection(db, "courses"), {
                title: title.trim(),
                description: desc.trim(),
                imageURL,
                pdfURL,
                createdAt: serverTimestamp(),
            });

            setTitle("");
            setDesc("");
            setImageFile(null);
            setPdfFile(null);
            setPdfUrlInput("");
            setFormKey((k) => k + 1);

            alert(t("admin.courseAdded"));
        } catch (err) {
            console.error(err);
            alert(t(getUploadErrorKey(err)));
        } finally {
            setUploading(false);
        }
    };

    const deleteCourse = async (id) => {
        if (!confirm(t("admin.confirmDeleteCourse"))) return;
        await deleteDoc(doc(db, "courses", id));
    };

    return (
        <div dir={dir}>
            <AdminPageHeader title={t("admin.coursesManage")} icon="📚" />

            <AdminForm
                key={formKey}
                title={t("admin.addCourse")}
                onSubmit={handleSubmit}
                actions={
                    <AdminPrimaryButton disabled={uploading}>
                        {uploading ? t("admin.uploading") : t("admin.addCourse")}
                    </AdminPrimaryButton>
                }
            >
                <AdminInput
                    label={t("admin.courseTitle")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    span={2}
                    required
                />
                <AdminTextarea
                    label={t("admin.courseDesc")}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    span="full"
                    required
                />
                <AdminFileInput
                    label={t("admin.uploadCover")}
                    accept="image/*"
                    fileName={imageFile?.name}
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    span={2}
                />
                <AdminFileInput
                    label={t("admin.uploadPdf")}
                    accept="application/pdf,.pdf"
                    fileName={pdfFile?.name}
                    onChange={(e) => {
                        setPdfFile(e.target.files?.[0] || null);
                        if (e.target.files?.[0]) setPdfUrlInput("");
                    }}
                    span={2}
                />
                <AdminInput
                    label={t("admin.pdfUrlLabel")}
                    hint={t("admin.pdfHint")}
                    type="url"
                    placeholder={t("admin.pdfUrlPlaceholder")}
                    value={pdfUrlInput}
                    onChange={(e) => {
                        setPdfUrlInput(e.target.value);
                        if (e.target.value.trim()) setPdfFile(null);
                    }}
                    disabled={Boolean(pdfFile)}
                    span="full"
                />
            </AdminForm>

            <h2 className="text-2xl font-bold mb-4">📘 {t("admin.currentCourses")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((c) => (
                    <div key={c.id} className="bg-white shadow p-4 rounded-xl">
                        <img
                            src={c.imageURL}
                            alt={c.title}
                            className="w-full h-40 object-cover rounded"
                        />

                        <h3 className="text-xl font-bold mt-3">{c.title}</h3>

                        {c.pdfURL ? (
                            <a
                                href={c.pdfURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline block mt-2"
                            >
                                {t("admin.downloadPdf")}
                            </a>
                        ) : (
                            <p className="text-amber-700 text-sm mt-2">{t("admin.noPdfAttached")}</p>
                        )}

                        <button
                            type="button"
                            onClick={() => deleteCourse(c.id)}
                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            {t("common.delete")}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
