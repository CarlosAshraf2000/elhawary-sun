import { useEffect, useState } from "react";
import { auth } from "../firebase";

/** Refresh ID token so Firestore rules see the latest auth.email claim. */
export function useRefreshAdminToken() {
    const [ready, setReady] = useState(false);
    const [authEmail, setAuthEmail] = useState("");

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const user = auth.currentUser;
            if (!user) {
                if (!cancelled) setReady(true);
                return;
            }

            try {
                await user.getIdToken(true);
                if (!cancelled) {
                    setAuthEmail(user.email || "");
                    setReady(true);
                }
            } catch {
                if (!cancelled) setReady(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return { ready, authEmail };
}
