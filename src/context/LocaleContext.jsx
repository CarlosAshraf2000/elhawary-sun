import { useCallback, useEffect, useMemo, useState } from "react";
import { translate } from "../i18n/index.js";
import { LocaleContext } from "./locale-context.js";

const STORAGE_KEY = "elhawary-locale";

function loadStored() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        /* ignore */
    }
    return { lang: "ar", currency: "EGP" };
}

function applyDocument(lang) {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle("font-arabic", lang === "ar");
    document.body.classList.toggle("font-latin", lang === "en");
}

export function LocaleProvider({ children }) {
    const [stored, setStored] = useState(loadStored);
    const lang = stored.lang === "en" ? "en" : "ar";
    const currency = stored.currency === "USD" ? "USD" : "EGP";
    const dir = lang === "ar" ? "rtl" : "ltr";

    useEffect(() => {
        applyDocument(lang);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, currency }));
        document.title = translate(lang, "seo.defaultTitle");
    }, [lang, currency]);

    const setLang = useCallback((next) => {
        setStored((prev) => ({ ...prev, lang: next }));
    }, []);

    const setCurrency = useCallback((next) => {
        setStored((prev) => ({ ...prev, currency: next }));
    }, []);

    const t = useCallback(
        (key, vars) => translate(lang, key, vars),
        [lang]
    );

    const value = useMemo(
        () => ({ lang, currency, dir, setLang, setCurrency, t }),
        [lang, currency, dir, setLang, setCurrency, t]
    );

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
