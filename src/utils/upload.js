const apiKey = import.meta.env.VITE_IMGBB_KEY;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PDF_MAX_BYTES = 15 * 1024 * 1024;

function assertPdfFile(file) {
    if (!file) throw new Error("PDF_MISSING");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("PDF_ONLY");
    }
    if (file.size > PDF_MAX_BYTES) {
        throw new Error("PDF_TOO_LARGE");
    }
}

export async function uploadImageToImgbb(file) {
    if (!apiKey) throw new Error("VITE_IMGBB_KEY is not set");

    const form = new FormData();
    form.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: form,
    });

    const data = await res.json();
    if (!data.success) throw new Error("IMAGE_UPLOAD_FAILED");
    return data.data.url;
}

/** Free tier — unsigned upload preset with resource type Raw/Auto */
export async function uploadPdfToCloudinary(file) {
    if (!cloudName || !cloudinaryPreset) {
        throw new Error("CLOUDINARY_NOT_CONFIGURED");
    }

    assertPdfFile(file);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", cloudinaryPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: "POST",
        body: form,
    });

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "PDF_UPLOAD_FAILED");
    }

    return data.secure_url;
}

export async function resolveCoursePdfUrl({ file, urlInput, normalizePdfUrl }) {
    if (file) {
        return uploadPdfToCloudinary(file);
    }

    const trimmed = String(urlInput || "").trim();
    if (trimmed) {
        return normalizePdfUrl(trimmed);
    }

    throw new Error("PDF_MISSING");
}
