import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { isAdminUser } from "../config/admin";
import { useLocale } from "../hooks/useLocale";

export default function ProtectedAdminRoute({ children }) {
    const { t } = useLocale();
    const [state, setState] = useState({ loading: true, allow: false });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setState({ loading: false, allow: isAdminUser(user) });
        });
        return () => unsub();
    }, []);

    if (state.loading) return <div className="p-10">{t("admin.loading")}</div>;
    if (!state.allow) return <Navigate to="/admin/login" replace />;
    return children;
}
