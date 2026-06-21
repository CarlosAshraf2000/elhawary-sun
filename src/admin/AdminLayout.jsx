import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useLocale } from "../hooks/useLocale";
import { useRefreshAdminToken } from "./useRefreshAdminToken";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t, dir } = useLocale();
    const { ready } = useRefreshAdminToken();

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner message={t("admin.loading")} />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen" dir={dir}>
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label={t("nav.closeMenu")}
                />
            )}

            <div className="flex-1 md:mr-64 min-h-screen bg-gray-50">
                <div className="md:hidden sticky top-0 z-20 bg-white shadow px-4 py-3 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="text-2xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded px-2"
                        aria-label={t("nav.openMenu")}
                    >
                        ☰
                    </button>
                    <span className="font-bold text-gold">{t("admin.panelTitle")}</span>
                </div>

                <div className="p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
