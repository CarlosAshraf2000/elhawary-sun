import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { isShowcaseMode } from "../config/commerce";
import CartButton from "./cart/CartButton";
import CartDrawer from "./cart/CartDrawer";
import ProductsMegaMenu from "./nav/ProductsMegaMenu";
import MobileNavDrawer from "./nav/MobileNavDrawer";
import SettingsMenu from "./nav/SettingsMenu";
import ProfileMenu from "./nav/ProfileMenu";
import { useLocale } from "../hooks/useLocale";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const location = useLocation();
    const { t, dir } = useLocale();
    const { user } = useAuth();

    const isAdminPage = location.pathname.startsWith("/admin");
    const showcase = isShowcaseMode();
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

                    <nav className="hidden lg:flex items-center gap-3" aria-label={t("nav.mainNav")}>
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
                        {!showcase && <CartButton onClick={() => setCartOpen(true)} />}
                    </nav>

                    <div className="lg:hidden flex items-center gap-2">
                        <SettingsMenu />
                        {!showcase && <CartButton onClick={() => setCartOpen(true)} />}
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

            {!showcase && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}

            <MobileNavDrawer
                open={open}
                onClose={() => setOpen(false)}
                dir={dir}
                t={t}
                navLinks={navLinks}
                profileLinks={profileLinks}
                onLogout={async () => {
                    await signOut(auth);
                    setOpen(false);
                }}
            />
        </>
    );
}
