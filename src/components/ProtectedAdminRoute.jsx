import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { checkIsAdmin } from "../config/admin";
import { useLocale } from "../hooks/useLocale";
import LoadingSpinner from "./ui/LoadingSpinner";

export default function ProtectedAdminRoute({ children }) {
    const { t } = useLocale();
    const [state, setState] = useState({ loading: true, allow: false });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            const allow = await checkIsAdmin(user);
            setState({ loading: false, allow });
        });
        return () => unsub();
    }, []);

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner message={t("admin.loading")} />
            </div>
        );
    }
    if (!state.allow) return <Navigate to="/admin/login" replace />;
    return children;
}
