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

export default function RoutePageMeta() {
    const { pathname } = useLocation();
    const { t } = useLocale();

    useEffect(() => {
        let key = ROUTE_TITLE_KEYS[pathname];
        if (!key && pathname.startsWith("/product/")) key = "seo.titleProduct";
        if (!key && pathname.startsWith("/project/")) key = "seo.titleProject";
        if (!key && pathname.startsWith("/courses/view")) key = "courses.viewerTitle";
        document.title = t(key || "seo.defaultTitle");
    }, [pathname, t]);

    return null;
}
