import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { filterActiveBanners } from "../data/promotions";

export function useBanners(placement) {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "banners"),
            (snap) => {
                const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setBanners(filterActiveBanners(all, placement));
                setLoading(false);
            },
            () => setLoading(false)
        );
        return unsub;
    }, [placement]);

    return { banners, loading };
}
