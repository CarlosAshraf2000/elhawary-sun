import { useState } from "react";
import { useLocale } from "../../hooks/useLocale";
import { PRODUCT_CATEGORIES, CATEGORY_IDS } from "../../data/productDefaults";

export default function ProductFiltersSidebar({ filters, applyFilters, countries = [] }) {
    const { t } = useLocale();
    const [local, setLocal] = useState({
        q: filters.q,
        kwMin: filters.kwMin,
        kwMax: filters.kwMax,
        kvaMin: filters.kvaMin,
        kvaMax: filters.kvaMax,
        loadSingle: filters.loadSingle,
        loadThree: filters.loadThree,
        country: filters.country,
    });

    const showAdvanced = filters.category === "inverters";

    return (
        <aside className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm h-fit sticky top-24">
            <h2 className="font-bold text-lg mb-4 border-b pb-2">{t("shop.searchProducts")}</h2>
            <input
                type="search"
                value={local.q}
                onChange={(e) => setLocal((s) => ({ ...s, q: e.target.value }))}
                placeholder={t("shop.searchPlaceholder")}
                className="w-full border rounded p-2 mb-3 text-sm"
            />
            <button
                type="button"
                onClick={() => applyFilters({ q: local.q })}
                className="w-full bg-dark text-white py-2 rounded font-bold mb-6 hover:opacity-90"
            >
                {t("common.search")}
            </button>

            <fieldset className="mb-6">
                <legend className="font-semibold mb-3">{t("admin.category")}</legend>
                <div className="space-y-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                                type="radio"
                                name="category"
                                checked={filters.category === cat.id}
                                onChange={() => applyFilters({ category: cat.id })}
                            />
                            {t(cat.labelKey)}
                        </label>
                    ))}
                </div>
            </fieldset>

            {showAdvanced && (
                <div className="space-y-4 border-t pt-4">
                    <div>
                        <label className="text-sm font-semibold block mb-2">{t("shop.powerRangeKw")}</label>
                        <div className="flex gap-2 items-center text-xs">
                            <span>{t("common.from")}</span>
                            <input type="number" className="w-16 border rounded p-1" value={local.kwMin}
                                onChange={(e) => setLocal((s) => ({ ...s, kwMin: Number(e.target.value) }))} />
                            <span>{t("common.to")}</span>
                            <input type="number" className="w-16 border rounded p-1" value={local.kwMax}
                                onChange={(e) => setLocal((s) => ({ ...s, kwMax: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-2">{t("shop.powerRangeKva")}</label>
                        <div className="flex gap-2 items-center text-xs">
                            <span>{t("common.from")}</span>
                            <input type="number" className="w-16 border rounded p-1" value={local.kvaMin}
                                onChange={(e) => setLocal((s) => ({ ...s, kvaMin: Number(e.target.value) }))} />
                            <span>{t("common.to")}</span>
                            <input type="number" className="w-16 border rounded p-1" value={local.kvaMax}
                                onChange={(e) => setLocal((s) => ({ ...s, kvaMax: Number(e.target.value) }))} />
                        </div>
                    </div>
                    <fieldset>
                        <legend className="text-sm font-semibold mb-2">{t("shop.loadType")}</legend>
                        <label className="flex items-center gap-2 text-sm mb-1">
                            <input type="checkbox" checked={local.loadSingle}
                                onChange={(e) => setLocal((s) => ({ ...s, loadSingle: e.target.checked }))} />
                            {t("shop.loadSingle")}
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={local.loadThree}
                                onChange={(e) => setLocal((s) => ({ ...s, loadThree: e.target.checked }))} />
                            {t("shop.loadThree")}
                        </label>
                    </fieldset>
                    {countries.length > 0 && (
                        <div>
                            <label className="text-sm font-semibold block mb-1">{t("shop.countryOrigin")}</label>
                            <select
                                className="w-full border rounded p-2 text-sm"
                                value={local.country}
                                onChange={(e) => setLocal((s) => ({ ...s, country: e.target.value }))}
                            >
                                <option value="">{t("shop.allSubcategories")}</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={() => applyFilters({
                    ...local,
                    loadSingle: local.loadSingle ? "1" : "",
                    loadThree: local.loadThree ? "1" : "",
                })}
                className="w-full mt-6 bg-dark text-white py-2.5 rounded font-bold hover:opacity-90"
            >
                {t("common.filter")}
            </button>
        </aside>
    );
}
