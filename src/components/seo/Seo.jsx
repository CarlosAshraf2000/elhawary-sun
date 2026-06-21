import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://elhawary-sun.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/icon.png`;

function upsertMeta(attr, key, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function upsertLink(rel, href, extra = {}) {
    if (!href) return;
    let selector = `link[rel="${rel}"]`;
    if (extra.hreflang) selector += `[hreflang="${extra.hreflang}"]`;
    let el = document.querySelector(selector);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        if (extra.hreflang) el.setAttribute("hreflang", extra.hreflang);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement("script");
        el.type = "application/ld+json";
        el.id = id;
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
}

/**
 * Unified SEO component — replaces PageMeta + RoutePageMeta.
 */
export default function Seo({
    title,
    titleKey,
    description,
    descriptionKey,
    image = DEFAULT_OG_IMAGE,
    type = "website",
    noindex = false,
    jsonLd,
    vars,
}) {
    const { pathname } = useLocation();
    const { t, lang } = useLocale();

    const pageTitle = title || (titleKey ? t(titleKey, vars) : t("seo.defaultTitle"));
    const pageDescription = description || (descriptionKey ? t(descriptionKey, vars) : t("seo.defaultDescription"));
    const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    const ogLocale = lang === "ar" ? "ar_EG" : "en_US";

    useEffect(() => {
        document.title = pageTitle;

        upsertMeta("name", "description", pageDescription);
        upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

        upsertMeta("property", "og:title", pageTitle);
        upsertMeta("property", "og:description", pageDescription);
        upsertMeta("property", "og:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);
        upsertMeta("property", "og:url", canonical);
        upsertMeta("property", "og:type", type);
        upsertMeta("property", "og:locale", ogLocale);
        upsertMeta("property", "og:site_name", t("company.name"));

        upsertMeta("name", "twitter:card", "summary_large_image");
        upsertMeta("name", "twitter:title", pageTitle);
        upsertMeta("name", "twitter:description", pageDescription);
        upsertMeta("name", "twitter:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);

        upsertLink("canonical", canonical);
        upsertLink("alternate", canonical, { hreflang: lang });
        upsertLink("alternate", canonical, { hreflang: lang === "ar" ? "en" : "ar" });
        upsertLink("alternate", canonical, { hreflang: "x-default" });

        upsertJsonLd("seo-org", {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: t("company.name"),
            description: t("seo.defaultDescription"),
            url: SITE_URL,
            logo: DEFAULT_OG_IMAGE,
            address: {
                "@type": "PostalAddress",
                addressLocality: "Minya",
                addressCountry: "EG",
            },
        });

        if (jsonLd) {
            upsertJsonLd("seo-page", jsonLd);
        } else {
            document.getElementById("seo-page")?.remove();
        }
    }, [pageTitle, pageDescription, canonical, image, type, noindex, jsonLd, ogLocale, lang, t]);

    return null;
}
