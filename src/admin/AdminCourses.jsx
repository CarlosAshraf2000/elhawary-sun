import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore";
import { uploadImageToImgbb } from "../utils/upload.js";
import { useLocale } from "../hooks/useLocale";

export default function AdminCourses() {
    const { t, dir } = useLocale();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [courses, setCourses] = useState([]);

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

        if (!title || !desc || !imageFile || !pdfFile) {
            return alert(t("admin.fillAllCourseData"));
        }

        setUploading(true);
        try {
            const imageURL = await uploadImageToImgbb(imageFile);
            const pdfURL = await uploadImageToImgbb(pdfFile);

            await addDoc(collection(db, "courses"), {
                title,
                description: desc,
                imageURL,
                pdfURL,
                createdAt: new Date()
            });

            setTitle("");
            setDesc("");
            setImageFile(null);
            setPdfFile(null);

            alert(t("admin.courseAdded"));
        } catch (err) {
            console.error(err);
            alert(t("admin.saveError"));
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
            <h1 className="text-3xl font-bold text-gold mb-6">📚 {t("admin.coursesManage")}</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
            >
                <input
                    type="text"
                    placeholder={t("admin.courseTitle")}
                    className="w-full border p-3 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder={t("admin.courseDesc")}
                    className="w-full border p-3 rounded"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />

                <label className="block text-sm text-gray-600">
                    {t("admin.uploadCover")}
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                </label>
                {imageFile && <p className="text-green-600">✔ {t("admin.imageUploaded")}</p>}

                <label className="block text-sm text-gray-600">
                    {t("admin.uploadPdf")}
                    <input
                        type="file"
                        accept="application/pdf,image/*"
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                </label>
                {pdfFile && <p className="text-green-600">✔ {t("admin.pdfUploaded")}</p>}

                <button className="bg-gold px-6 py-3 rounded font-bold w-full disabled:opacity-60" disabled={uploading}>
                    {uploading ? t("admin.uploading") : t("admin.addCourse")}
                </button>
            </form>

            <hr className="my-10" />

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

                        <a
                            href={c.pdfURL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline block mt-2"
                        >
                            {t("admin.downloadPdf")}
                        </a>

                        <button
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
