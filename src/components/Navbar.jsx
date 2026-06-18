import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import CartButton from "./cart/CartButton";
import CartDrawer from "./cart/CartDrawer";
import ProductsMegaMenu from "./nav/ProductsMegaMenu";
import SettingsMenu from "./nav/SettingsMenu";
import ProfileMenu from "./nav/ProfileMenu";
import { useLocale } from "../hooks/useLocale";
import { useAuth } from "../hooks/useAuth";
import { CATEGORY_IDS } from "../data/productDefaults";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const location = useLocation();
    const { t, dir } = useLocale();
    const { user } = useAuth();

    const isAdminPage = location.pathname.startsWith("/admin");
    if (isAdminPage) return null;

    const profileLinks = user
        ? [
              ...(location.pathname !== "/account" ? [{ to: "/account", label: t("nav.myAccount") }] : []),
              { action: "logout", label: t("auth.logout") },
          ]
        : [
              { to: "/login", label: t("nav.login") },
              { to: "/register", label: t("nav.register") },
          ].filter((item) => !item.to || location.pathname !== item.to);

    const navLinks = [
        { to: "/", label: t("nav.home") },
        { to: "/about", label: t("nav.about") },
        { to: "/services", label: t("nav.services") },
        { to: "/projects", label: t("nav.projects") },
        { to: "/contact", label: t("nav.contact") },
        { to: "/quote", label: t("nav.quote") },
        { to: "/courses", label: t("nav.courses") },
    ];

    const linkClass = (path) =>
        `transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded px-1 ${
            location.pathname === path || (path === "/products" && location.pathname.startsWith("/product"))
                ? "text-gold border-b-2 border-gold"
                : "text-black hover:text-gold"
        }`;

    return (
        <>
            <header className="glass-nav fixed top-0 w-full z-50 shadow-3d-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                        <span className="text-2xl font-bold text-gold text-3d">{t("company.name")}</span>
                        <img src={logo} alt={t("company.name")} className="w-12 h-12 object-contain drop-shadow-md" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-3" aria-label={t("nav.mainNav")}>
                        <ul className="flex gap-4 text-lg font-semibold items-center">
                            <li>
                                <Link to="/" className={linkClass("/")}>{t("nav.home")}</Link>
                            </li>
                            <li>
                                <ProductsMegaMenu linkClass={linkClass} />
                            </li>
                            {navLinks.slice(1).map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className={linkClass(link.to)}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <ProfileMenu />
                        <SettingsMenu />
                        <CartButton onClick={() => setCartOpen(true)} />
                    </nav>

                    <div className="md:hidden flex items-center gap-2">
                        <SettingsMenu />
                        <CartButton onClick={() => setCartOpen(true)} />
                        <button
                            type="button"
                            className="text-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                            onClick={() => setOpen(!open)}
                            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
                            aria-expanded={open}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={t("nav.mobileNav")}
                dir={dir}
                className={`fixed top-0 ${dir === "rtl" ? "right-0 translate-x-full" : "left-0 -translate-x-full"} h-full w-64 max-w-[85vw] glass-drawer text-white shadow-3d-lg transform transition-transform duration-300 z-50 ${
                    open ? "!translate-x-0" : ""
                }`}
            >
                <div className="p-6 flex flex-col gap-4 text-lg font-semibold">
                    <button type="button" className="text-3xl self-end" onClick={() => setOpen(false)} aria-label={t("nav.closeMenu")}>✕</button>
                    <Link to="/" onClick={() => setOpen(false)} className="hover:text-gold">{t("nav.home")}</Link>
                    <Link to="/products" onClick={() => setOpen(false)} className="hover:text-gold">{t("nav.products")}</Link>
                    {CATEGORY_IDS.map((id) => (
                        <Link key={id} to={`/products?category=${id}`} onClick={() => setOpen(false)} className="hover:text-gold text-base ps-4">
                            {t(`categories.${id}`)}
                        </Link>
                    ))}
                    {navLinks.slice(1).map((link) => (
                        <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="hover:text-gold">{link.label}</Link>
                    ))}
                    {profileLinks.map((link) =>
                        link.action === "logout" ? (
                            <button
                                key="logout"
                                type="button"
                                onClick={async () => {
                                    await signOut(auth);
                                    setOpen(false);
                                }}
                                className="hover:text-gold text-start"
                            >
                                {link.label}
                            </button>
                        ) : (
                            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="hover:text-gold">
                                {link.label}
                            </Link>
                        )
                    )}
                </div>
            </div>

            {open && (
                <button type="button" className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} aria-label={t("nav.closeMenu")} />
            )}
        </>
    );
}
