import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import RoutePageMeta from "./components/seo/RoutePageMeta";
import ErrorBoundary from "./components/ui/ErrorBoundary";
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

    if (isAdminPage) {
        return (
            <ErrorBoundary>
                <RoutePageMeta />
                <Outlet />
            </ErrorBoundary>
        );
    }

    return (
        <div className="flex flex-col min-h-screen dark:bg-surface">
            <RoutePageMeta />
            <Navbar />

            <main className="flex-grow pt-20">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>

            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
