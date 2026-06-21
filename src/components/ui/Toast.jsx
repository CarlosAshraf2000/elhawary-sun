import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./toast-context.js";

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="status"
                        className={`px-5 py-3 rounded-btn shadow-lg text-sm font-semibold ${
                            toast.type === "error"
                                ? "bg-red-600 text-white"
                                : toast.type === "success"
                                  ? "bg-green-600 text-white"
                                  : "bg-dark text-white"
                        }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
