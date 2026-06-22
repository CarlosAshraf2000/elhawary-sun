const fieldClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:opacity-60 disabled:bg-gray-50";

const spanClass = (span) => {
    if (span === "full") return "md:col-span-2 lg:col-span-3";
    if (span === 2) return "md:col-span-2";
    return "";
};

export function AdminPageHeader({ title, icon }) {
    return (
        <h1 className="text-3xl font-bold text-gold mb-6 flex items-center gap-2">
            {icon && <span aria-hidden>{icon}</span>}
            {title}
        </h1>
    );
}

export function AdminForm({ title, onSubmit, children, actions }) {
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 md:p-8 mb-10"
        >
            {title && (
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {children}
            </div>
            {actions && (
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    {actions}
                </div>
            )}
        </form>
    );
}

export function AdminField({ label, hint, span = 1, children, className = "" }) {
    return (
        <div className={`space-y-1.5 ${spanClass(span)} ${className}`}>
            {label && <span className="block text-sm font-semibold text-gray-700">{label}</span>}
            {children}
            {hint && <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>}
        </div>
    );
}

export function AdminInput({ label, hint, span, className = "", ...props }) {
    return (
        <AdminField label={label} hint={hint} span={span}>
            <input className={`${fieldClass} ${className}`} {...props} />
        </AdminField>
    );
}

export function AdminTextarea({ label, hint, span, rows = 3, className = "", ...props }) {
    return (
        <AdminField label={label} hint={hint} span={span}>
            <textarea className={`${fieldClass} resize-y min-h-[88px] ${className}`} rows={rows} {...props} />
        </AdminField>
    );
}

export function AdminSelect({ label, hint, span, children, className = "", ...props }) {
    return (
        <AdminField label={label} hint={hint} span={span}>
            <select className={`${fieldClass} ${className}`} {...props}>
                {children}
            </select>
        </AdminField>
    );
}

export function AdminFileInput({ label, hint, span, fileName, className = "", ...props }) {
    return (
        <AdminField label={label} hint={hint} span={span}>
            <input
                type="file"
                className={`${fieldClass} file:me-3 file:rounded-lg file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-gray-800 hover:file:bg-gold/25 ${className}`}
                {...props}
            />
            {fileName && <p className="text-sm text-green-700 font-medium">✔ {fileName}</p>}
        </AdminField>
    );
}

export function AdminCheckbox({ label, span, ...props }) {
    return (
        <AdminField span={span}>
            <label className="flex items-center gap-2.5 cursor-pointer select-none min-h-[42px]">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold/40"
                    {...props}
                />
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
        </AdminField>
    );
}

export function AdminDateInput({ label, span, ...props }) {
    return <AdminInput label={label} type="date" span={span} {...props} />;
}

export function AdminPrimaryButton({ children, disabled, className = "", ...props }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 bg-gold hover:bg-goldDark text-black font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-60 min-w-[140px] ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function AdminSecondaryButton({ children, className = "", ...props }) {
    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gold text-gray-800 font-bold px-6 py-2.5 rounded-xl transition min-w-[120px] ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
