import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaHome,
    FaBoxOpen,
    FaInfoCircle,
    FaTools,
    FaProjectDiagram,
    FaEnvelope,
    FaFileInvoiceDollar,
    FaGraduationCap,
    FaUser,
    FaSignInAlt,
    FaUserPlus,
    FaSignOutAlt,
    FaTimes,
    FaChevronDown,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { CATEGORY_IDS } from "../../data/productDefaults";

function NavItem({ to, label, icon: Icon, active, onNavigate }) {
    return (
        <Link
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition ${
                active
                    ? "bg-gold/20 text-gold border-s-2 border-gold"
                    : "text-gray-200 hover:bg-white/5 hover:text-gold"
            }`}
        >
            {Icon && <Icon className="shrink-0 text-lg opacity-80" aria-hidden />}
            <span className="leading-snug">{label}</span>
        </Link>
    );
}

export default function MobileNavDrawer({
    open,
    onClose,
    dir,
    t,
    navLinks,
    profileLinks,
    onLogout,
}) {
    const location = useLocation();
    const [productsOpen, setProductsOpen] = useState(
        () => location.pathname.startsWith("/product")
    );

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        if (path === "/products") {
            return location.pathname === "/products" || location.pathname.startsWith("/product");
        }
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const categoryActive = (id) => {
        const params = new URLSearchParams(location.search);
        return location.pathname === "/products" && params.get("category") === id;
    };

    const mainIcons = {
        "/": FaHome,
        "/about": FaInfoCircle,
        "/services": FaTools,
        "/projects": FaProjectDiagram,
        "/contact": FaEnvelope,
        "/quote": FaFileInvoiceDollar,
        "/courses": FaGraduationCap,
    };

    return (
        <>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={t("nav.mobileNav")}
                aria-hidden={!open}
                dir={dir}
                className={`fixed top-0 inset-y-0 z-[60] w-[min(320px,88vw)] max-w-full glass-drawer mobile-drawer shadow-3d-lg flex flex-col transform transition-transform duration-300 ease-out ${
                    dir === "rtl"
                        ? "right-0 translate-x-full border-s border-gold/15"
                        : "left-0 -translate-x-full border-e border-gold/15"
                } ${open ? "!translate-x-0" : ""}`}
            >
                <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center gap-2 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
                    >
                        <img src={logo} alt="" className="w-10 h-10 object-contain shrink-0" />
                        <span className="text-gold font-bold text-lg truncate">{t("company.name")}</span>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-gold/20 hover:text-gold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        aria-label={t("nav.closeMenu")}
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-1">
                    <NavItem
                        to="/"
                        label={t("nav.home")}
                        icon={FaHome}
                        active={isActive("/")}
                        onNavigate={onClose}
                    />

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setProductsOpen((v) => !v)}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-semibold transition ${
                                isActive("/products")
                                    ? "bg-gold/20 text-gold"
                                    : "text-gray-200 hover:bg-white/5 hover:text-gold"
                            }`}
                            aria-expanded={productsOpen}
                        >
                            <span className="flex items-center gap-3">
                                <FaBoxOpen className="shrink-0 text-lg opacity-80" aria-hidden />
                                {t("nav.products")}
                            </span>
                            <FaChevronDown
                                className={`shrink-0 text-sm transition-transform ${productsOpen ? "rotate-180" : ""}`}
                                aria-hidden
                            />
                        </button>

                        {productsOpen && (
                            <ul className="mt-1 mb-2 ms-3 ps-3 border-s border-gold/25 space-y-0.5">
                                <li>
                                    <Link
                                        to="/products"
                                        onClick={onClose}
                                        className={`block px-3 py-2.5 rounded-lg text-sm leading-snug transition ${
                                            location.pathname === "/products" && !new URLSearchParams(location.search).get("category")
                                                ? "text-gold bg-gold/10 font-semibold"
                                                : "text-gray-400 hover:text-gold hover:bg-white/5"
                                        }`}
                                    >
                                        {t("categories.all")}
                                    </Link>
                                </li>
                                {CATEGORY_IDS.map((id) => (
                                    <li key={id}>
                                        <Link
                                            to={`/products?category=${id}`}
                                            onClick={onClose}
                                            className={`block px-3 py-2.5 rounded-lg text-sm leading-snug transition ${
                                                categoryActive(id)
                                                    ? "text-gold bg-gold/10 font-semibold"
                                                    : "text-gray-400 hover:text-gold hover:bg-white/5"
                                            }`}
                                        >
                                            {t(`categories.${id}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {navLinks.slice(1).map((link) => (
                        <NavItem
                            key={link.to}
                            to={link.to}
                            label={link.label}
                            icon={mainIcons[link.to]}
                            active={isActive(link.to)}
                            onNavigate={onClose}
                        />
                    ))}
                </nav>

                <div className="shrink-0 px-4 py-4 border-t border-white/10 space-y-1 bg-black/20">
                    {profileLinks.map((link) =>
                        link.action === "logout" ? (
                            <button
                                key="logout"
                                type="button"
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-red-400 hover:bg-red-500/10 transition text-start"
                            >
                                <FaSignOutAlt className="shrink-0" aria-hidden />
                                {link.label}
                            </button>
                        ) : (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition ${
                                    isActive(link.to)
                                        ? "bg-gold/20 text-gold"
                                        : "text-gray-200 hover:bg-white/5 hover:text-gold"
                                }`}
                            >
                                {link.to === "/login" || link.to === "/register" ? (
                                    link.to === "/login" ? (
                                        <FaSignInAlt className="shrink-0" aria-hidden />
                                    ) : (
                                        <FaUserPlus className="shrink-0" aria-hidden />
                                    )
                                ) : (
                                    <FaUser className="shrink-0" aria-hidden />
                                )}
                                {link.label}
                            </Link>
                        )
                    )}
                </div>
            </div>

            {open && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[55] lg:hidden"
                    onClick={onClose}
                    aria-label={t("nav.closeMenu")}
                />
            )}
        </>
    );
}
