import ar from "./locales/ar.js";
import en from "./locales/en.js";

const locales = { ar, en };

function getNested(obj, path) {
    return path.split(".").reduce((acc, part) => {
        if (acc == null) return undefined;
        const idx = Number(part);
        if (!Number.isNaN(idx) && Array.isArray(acc)) return acc[idx];
        return acc[part];
    }, obj);
}

export function translate(lang, key, vars = {}) {
    const dict = locales[lang] || locales.ar;
    let value = getNested(dict, key);
    if (value === undefined) {
        value = getNested(locales.ar, key);
    }
    if (value === undefined) return key;
    if (typeof value !== "string") return value;

    return value.replace(/\{\{(\w+)\}\}/g, (_, k) =>
        vars[k] != null ? String(vars[k]) : `{{${k}}}`
    );
}

export function getLocaleData(lang) {
    return locales[lang] || locales.ar;
}

function flattenKeys(obj, prefix = "") {
    const keys = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
            keys.push(...flattenKeys(v, path));
        } else if (!Array.isArray(v)) {
            keys.push(path);
        }
    }
    return keys;
}

export function getLocaleParityIssues() {
    const arKeys = new Set(flattenKeys(ar));
    const enKeys = new Set(flattenKeys(en));
    const missingInEn = [...arKeys].filter((k) => !enKeys.has(k));
    const missingInAr = [...enKeys].filter((k) => !arKeys.has(k));
    return { missingInEn, missingInAr };
}

export { ar, en };
