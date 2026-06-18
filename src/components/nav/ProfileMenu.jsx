import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { auth } from "../../firebase";
import { useLocale } from "../../hooks/useLocale";
import { useAuth } from "../../hooks/useAuth";
import NavDropdown from "./NavDropdown";

const GUEST_LINKS = [
    { to: "/login", labelKey: "nav.login" },
    { to: "/register", labelKey: "nav.register" },
];

export default function ProfileMenu() {
    const { t } = useLocale();
    const { pathname } = useLocation();
    const { user } = useAuth();

    const guestItems = GUEST_LINKS.filter((item) => pathname !== item.to);
    const showAccount = user && pathname !== "/account";

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <NavDropdown
            align="end"
            trigger={
                <button
                    type="button"
                    className="flex items-center gap-1 text-dark hover:text-gold transition font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded px-1"
                    aria-haspopup="true"
                    aria-label={t("nav.profile")}
                >
                    <FaUser className="text-gold" />
                    <span className="hidden lg:inline">{t("nav.profile")}</span>
                    <FaChevronDown className="text-xs" />
                </button>
            }
        >
            {user ? (
                <>
                    {showAccount && (
                        <Link
                            to="/account"
                            className="block px-4 py-2.5 text-gray-800 hover:bg-gold/20 transition border-b border-gray-100"
                            role="menuitem"
                        >
                            {t("nav.myAccount")}
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-start px-4 py-2.5 text-gray-800 hover:bg-gold/20 transition"
                        role="menuitem"
                    >
                        {t("auth.logout")}
                    </button>
                </>
            ) : (
                guestItems.map((item, index) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`block px-4 py-2.5 text-gray-800 hover:bg-gold/20 transition ${
                            index < guestItems.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                        role="menuitem"
                    >
                        {t(item.labelKey)}
                    </Link>
                ))
            )}
        </NavDropdown>
    );
}
