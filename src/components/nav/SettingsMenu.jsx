import { FaCog, FaMoon, FaSun } from "react-icons/fa";
import { useLocale } from "../../hooks/useLocale";
import NavDropdown from "./NavDropdown";

export default function SettingsMenu() {
    const { lang, currency, theme, setLang, setCurrency, setTheme, t } = useLocale();

    const itemClass = (active) =>
        `block w-full text-start px-4 py-2 text-sm transition ${
            active ? "bg-gold text-black font-bold" : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <NavDropdown
            align="end"
            trigger={
                <button
                    type="button"
                    className="p-2 text-xl text-dark hover:text-gold transition rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={t("nav.settings")}
                >
                    <FaCog />
                </button>
            }
        >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 mb-2">{t("settings.theme")}</p>
                <button type="button" className={itemClass(theme === "light")} onClick={() => setTheme("light")}>
                    <FaSun className="inline me-2" /> {t("settings.lightMode")}
                </button>
                <button type="button" className={itemClass(theme === "dark")} onClick={() => setTheme("dark")}>
                    <FaMoon className="inline me-2" /> {t("settings.darkMode")}
                </button>
            </div>
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 mb-2">{t("settings.language")}</p>
                <button type="button" className={itemClass(lang === "ar")} onClick={() => setLang("ar")}>
                    {t("common.langAr")}
                </button>
                <button type="button" className={itemClass(lang === "en")} onClick={() => setLang("en")}>
                    {t("common.langEn")}
                </button>
            </div>
            <div className="px-4 py-2">
                <p className="text-xs font-bold text-gray-500 mb-2">{t("settings.currency")}</p>
                <button type="button" className={itemClass(currency === "EGP")} onClick={() => setCurrency("EGP")}>
                    {t("common.currencyEgp")}
                </button>
                <button type="button" className={itemClass(currency === "USD")} onClick={() => setCurrency("USD")}>
                    {t("common.currencyUsd")}
                </button>
            </div>
        </NavDropdown>
    );
}
