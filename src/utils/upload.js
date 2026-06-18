const apiKey = import.meta.env.VITE_IMGBB_KEY;

export async function uploadImageToImgbb(file) {
    if (!apiKey) throw new Error("VITE_IMGBB_KEY is not set");

    const form = new FormData();
    form.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: form,
    });

    const data = await res.json();
    if (!data.success) throw new Error("فشل رفع الصورة");
    return data.data.url;
}
