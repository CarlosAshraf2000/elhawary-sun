// src/hooks/useAdmin.js
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { ADMIN_EMAIL, isAdminUser } from "../config/admin";

export default function useAdmin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ADMIN_EMAIL) {
            console.warn(
                "VITE_ADMIN_EMAIL is not set. Admin checks will always be false."
            );
        }
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const isAdmin = useMemo(() => isAdminUser(user), [user]);

    return { user, isAdmin, loading };
}
