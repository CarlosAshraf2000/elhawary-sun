import { Link, useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useLocale } from "../hooks/useLocale";
import { isShowcaseMode } from "../config/commerce";

const allNavItems = [
    { to: "/admin/dashboard", labelKey: "admin.dashboard" },
    { to: "/admin/orders", labelKey: "admin.orders", hideInShowcase: true },
    { to: "/admin/quotes", labelKey: "admin.quotes" },
    { to: "/admin/products", labelKey: "admin.products" },
    { to: "/admin/promotions", labelKey: "admin.promotions" },
    { to: "/admin/coupons", labelKey: "admin.coupons", hideInShowcase: true },
    { to: "/admin/projects", labelKey: "admin.projects" },
    { to: "/admin/courses", labelKey: "admin.courses" },
];

export default function AdminSidebar({ open = false, onClose, onNavigate }) {
    const { pathname } = useRouterLocation();
    const navigate = useNavigate();
    const { t, lang, setLang, dir } = useLocale();
    const navItems = isShowcaseMode()
        ? allNavItems.filter((item) => !item.hideInShowcase)
        : allNavItems;

    const handleLogout = async () => {
        await signOut(auth);
        onClose?.();
        onNavigate?.();
        navigate("/admin/login");
    };

    const linkClass = (path) =>
        `block py-3 px-5 rounded-lg text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            pathname === path
                ? "bg-gold text-black"
                : "text-gray-700 hover:bg-gray-200"
        }`;

    const langBtnClass = (active) =>
        `flex-1 py-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
            active ? "bg-gold text-black" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`;

    return (
        <aside
            className={`w-64 max-w-[85vw] bg-white shadow-lg h-screen fixed top-0 right-0 p-6 z-40 transform transition-transform duration-300 ${
                open ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0`}
            dir={dir}
            aria-label={t("admin.sidebarLabel")}
        >
            <div className="flex items-center justify-between mb-8 md:block">
                <h2 className="text-2xl font-bold text-gold">{t("admin.panelTitle")}</h2>
                <button
                    type="button"
                    className="md:hidden text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                    onClick={onClose}
                    aria-label={t("nav.closeMenu")}
                >
                    ✕
                </button>
            </div>

            <nav className="flex flex-col gap-3">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        className={linkClass(item.to)}
                        to={item.to}
                        onClick={onClose}
                    >
                        {t(item.labelKey)}
                    </Link>
                ))}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-500 mb-2 px-5">{t("settings.language")}</p>
                    <div className="flex gap-2 px-5">
                        <button
                            type="button"
                            className={langBtnClass(lang === "ar")}
                            onClick={() => setLang("ar")}
                            aria-pressed={lang === "ar"}
                            aria-label={t("common.langAr")}
                        >
                            AR
                        </button>
                        <button
                            type="button"
                            className={langBtnClass(lang === "en")}
                            onClick={() => setLang("en")}
                            aria-pressed={lang === "en"}
                            aria-label={t("common.langEn")}
                        >
                            EN
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-6 text-red-500 font-bold text-right w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded px-5 py-3"
                >
                    {t("admin.logout")}
                </button>
            </nav>
        </aside>
    );
}
