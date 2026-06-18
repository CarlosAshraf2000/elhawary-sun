import { useEffect } from "react";
import { useLocale } from "../../hooks/useLocale";

export default function PageMeta({ titleKey, descriptionKey, vars }) {
    const { t, lang } = useLocale();

    useEffect(() => {
        if (titleKey) {
            document.title = t(titleKey, vars);
        }
        if (descriptionKey) {
            let meta = document.querySelector('meta[name="description"]');
            if (meta) {
                meta.setAttribute("content", t(descriptionKey, vars));
            }
        }
    }, [titleKey, descriptionKey, vars, t, lang]);

    return null;
}
