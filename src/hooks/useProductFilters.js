import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const PER_PAGE = 12;

export function useProductFilters(products) {
    const [params, setParams] = useSearchParams();

    const filters = useMemo(() => ({
        category: params.get("category") || "all",
        q: params.get("q") || "",
        page: Math.max(1, Number(params.get("page")) || 1),
        kwMin: Number(params.get("kwMin")) || 0,
        kwMax: Number(params.get("kwMax")) || 1000,
        kvaMin: Number(params.get("kvaMin")) || 0,
        kvaMax: Number(params.get("kvaMax")) || 1000,
        loadSingle: params.get("loadSingle") === "1",
        loadThree: params.get("loadThree") === "1",
        country: params.get("country") || "",
    }), [params]);

    const filtered = useMemo(() => {
        let list = [...products];
        if (filters.category !== "all") {
            list = list.filter((p) => p.category === filters.category);
        }
        if (filters.q.trim()) {
            const q = filters.q.trim().toLowerCase();
            list = list.filter((p) =>
                [p.title, p.brand, p.model, p.description].some((f) =>
                    String(f || "").toLowerCase().includes(q)
                )
            );
        }
        if (filters.category === "inverters") {
            list = list.filter((p) => {
                const kw = Number(p.powerKw) || 0;
                const kva = Number(p.powerKva) || 0;
                if (kw && (kw < filters.kwMin || kw > filters.kwMax)) return false;
                if (kva && (kva < filters.kvaMin || kva > filters.kvaMax)) return false;
                if (filters.loadSingle && p.loadType !== "single") return false;
                if (filters.loadThree && p.loadType !== "three") return false;
                if (filters.country && p.countryOfOrigin !== filters.country) return false;
                return true;
            });
        }
        return list;
    }, [products, filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const page = Math.min(filters.page, totalPages);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value === "" || value == null) next.delete(key);
        else next.set(key, String(value));
        if (key !== "page") next.delete("page");
        setParams(next);
    };

    const applyFilters = (patch) => {
        const next = new URLSearchParams(params);
        Object.entries(patch).forEach(([k, v]) => {
            if (v === "" || v == null || v === false) next.delete(k);
            else next.set(k, v === true ? "1" : String(v));
        });
        next.delete("page");
        setParams(next);
    };

    return { filters, filtered, paginated, totalPages, page, setFilter, applyFilters, perPage: PER_PAGE };
}
