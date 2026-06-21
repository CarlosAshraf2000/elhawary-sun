import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";

const ROUTE_TITLE_KEYS = {
    "/": "seo.titleHome",
    "/about": "seo.titleAbout",
    "/services": "seo.titleServices",
    "/projects": "seo.titleProjects",
    "/contact": "seo.titleContact",
    "/quote": "seo.titleQuote",
    "/courses": "seo.titleCourses",
    "/products": "seo.titleProducts",
    "/cart": "seo.titleCart",
    "/checkout": "seo.titleCheckout",
    "/login": "seo.titleLogin",
    "/register": "seo.titleRegister",
    "/account": "seo.titleAccount",
};

const NOINDEX_PREFIXES = ["/admin", "/login", "/register", "/account", "/cart", "/checkout"];

/** Fallback route titles when pages don't render Seo directly */
export default function RoutePageMeta() {
    const { pathname } = useLocation();
    const { t } = useLocale();

    useEffect(() => {
        let key = ROUTE_TITLE_KEYS[pathname];
        if (!key && pathname.startsWith("/product/")) key = "seo.titleProduct";
        if (!key && pathname.startsWith("/project/")) key = "seo.titleProject";
        if (!key && pathname.startsWith("/course-viewer")) key = "courses.viewerTitle";

        const noindex = NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));
        if (noindex) {
            let robots = document.querySelector('meta[name="robots"]');
            if (!robots) {
                robots = document.createElement("meta");
                robots.setAttribute("name", "robots");
                document.head.appendChild(robots);
            }
            robots.setAttribute("content", "noindex, nofollow");
        }

        if (key) {
            document.title = t(key);
        }
    }, [pathname, t]);

    return null;
}
