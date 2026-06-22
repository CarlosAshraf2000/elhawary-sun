import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { uploadImageToImgbb } from "../utils/upload";
import { useLocale } from "../hooks/useLocale";
import {
    AdminPageHeader,
    AdminForm,
    AdminInput,
    AdminTextarea,
    AdminFileInput,
    AdminPrimaryButton,
    AdminSecondaryButton,
} from "./ui/AdminFields";

export default function AdminProjects() {
    const { t, dir } = useLocale();
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imagesFiles, setImagesFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formKey, setFormKey] = useState(0);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "projects"), (snap) => {
            setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const addProject = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || imagesFiles.length === 0) {
            alert(t("admin.fillAllFields"));
            return;
        }

        try {
            setUploading(true);

            const uploadedImages = [];
            for (const file of imagesFiles) {
                const url = await uploadImageToImgbb(file);
                uploadedImages.push(url);
            }

            await addDoc(collection(db, "projects"), {
                title: title.trim(),
                description: description.trim(),
                images: uploadedImages,
                createdAt: serverTimestamp(),
            });

            setTitle("");
            setDescription("");
            setImagesFiles([]);
            setFormKey((k) => k + 1);
            alert(t("admin.projectAdded"));
        } catch (err) {
            console.error(err);
            alert(t("admin.projectUploadError"));
        } finally {
            setUploading(false);
        }
    };

    const deleteProject = async (id) => {
        if (!confirm(t("admin.confirmDeleteProject"))) return;
        await deleteDoc(doc(db, "projects", id));
    };

    const startEditProject = (project) => {
        setEditingProject({ ...project, newImages: [] });
    };

    const removeImage = (index) => {
        const updated = editingProject.images.filter((_, i) => i !== index);
        setEditingProject({ ...editingProject, images: updated });
    };

    const saveEditProject = async () => {
        try {
            const newImagesUrls = [];

            if (editingProject.newImages?.length > 0) {
                for (const file of editingProject.newImages) {
                    const url = await uploadImageToImgbb(file);
                    newImagesUrls.push(url);
                }
            }

            await updateDoc(doc(db, "projects", editingProject.id), {
                title: editingProject.title,
                description: editingProject.description,
                images: [...editingProject.images, ...newImagesUrls],
            });

            alert(t("admin.changesSaved"));
            setEditingProject(null);
        } catch (err) {
            console.error(err);
            alert(t("admin.editSaveError"));
        }
    };

    return (
        <div dir={dir}>
            <AdminPageHeader title={t("admin.projectsManage")} icon="📸" />

            <AdminForm
                key={formKey}
                title={t("admin.addProject")}
                onSubmit={addProject}
                actions={
                    <AdminPrimaryButton disabled={uploading}>
                        {uploading ? t("admin.uploading") : t("admin.add")}
                    </AdminPrimaryButton>
                }
            >
                <AdminInput
                    label={t("admin.projectTitle")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <AdminTextarea
                    label={t("admin.projectDesc")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    span={2}
                    required
                />
                <AdminFileInput
                    label={t("admin.projectImages")}
                    hint={t("admin.projectImagesHint")}
                    accept="image/*"
                    multiple
                    fileName={imagesFiles.length ? t("admin.filesSelected", { count: imagesFiles.length }) : ""}
                    onChange={(e) => setImagesFiles([...e.target.files])}
                    span="full"
                />
            </AdminForm>

            <div className="grid md:grid-cols-3 gap-6">
                {projects.map((p) => (
                    <div key={p.id} className="bg-white shadow-md border border-gray-100 rounded-2xl p-4">
                        <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-3">{p.description}</p>

                        {p.images?.length > 0 && (
                            <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-full h-48 object-cover rounded-xl mb-3"
                            />
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
                                onClick={() => startEditProject(p)}
                            >
                                {t("common.edit")}
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
                                onClick={() => deleteProject(p.id)}
                            >
                                {t("common.delete")}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingProject && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" dir={dir}>
                        <h2 className="text-2xl font-bold mb-6">{t("admin.editProject")}</h2>

                        <div className="space-y-4">
                            <AdminInput
                                label={t("admin.projectTitle")}
                                value={editingProject.title}
                                onChange={(e) =>
                                    setEditingProject({ ...editingProject, title: e.target.value })
                                }
                            />
                            <AdminTextarea
                                label={t("admin.projectDesc")}
                                rows={4}
                                value={editingProject.description}
                                onChange={(e) =>
                                    setEditingProject({
                                        ...editingProject,
                                        description: e.target.value,
                                    })
                                }
                            />

                            <p className="text-sm font-semibold text-gray-700">{t("admin.currentImages")}</p>
                            <div className="grid grid-cols-2 gap-3">
                                {editingProject.images?.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img} alt="" className="w-full h-32 object-cover rounded-xl" />
                                        <button
                                            type="button"
                                            className="absolute top-1 start-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                            onClick={() => removeImage(index)}
                                        >
                                            {t("common.delete")}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <AdminFileInput
                                label={t("admin.addMoreImages")}
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                    setEditingProject({
                                        ...editingProject,
                                        newImages: Array.from(e.target.files),
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
                            <AdminSecondaryButton onClick={() => setEditingProject(null)}>
                                {t("common.cancel")}
                            </AdminSecondaryButton>
                            <AdminPrimaryButton type="button" onClick={saveEditProject}>
                                {t("admin.saveChanges")}
                            </AdminPrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
