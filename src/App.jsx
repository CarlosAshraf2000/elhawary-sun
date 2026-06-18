import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import RoutePageMeta from "./components/seo/RoutePageMeta";
import AppRouter from "./router/AppRouter";
import { useLocale } from "./hooks/useLocale";

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLocale();
    const isAdminPage = location.pathname.startsWith("/admin");

    useEffect(() => {
        let buffer = "";

        const handler = (e) => {
            buffer += e.key;

            if (buffer.includes("2004")) {
                const ok = confirm(t("common.adminShortcutConfirm"));
                if (ok) navigate("/admin/login");
                buffer = "";
            }

            buffer = buffer.slice(-10);
        };

        window.addEventListener("keydown", handler);

        return () => window.removeEventListener("keydown", handler);
    }, [navigate, t]);

    return (
        <div className="flex flex-col min-h-screen">
            <RoutePageMeta />
            <Navbar />

            <main className={`flex-grow ${isAdminPage ? "" : "pt-20"}`}>
                <AppRouter />
            </main>

            {!isAdminPage && (
                <>
                    <Footer />
                    <WhatsAppFloat />
                </>
            )}
        </div>
    );
}
