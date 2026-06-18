import { useEffect, useRef, useState, Children, cloneElement, isValidElement } from "react";
import { Link } from "react-router-dom";

function wrapWithClose(children, onClose) {
    return Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        if (child.type === Link) {
            return cloneElement(child, {
                onClick: (e) => {
                    child.props.onClick?.(e);
                    onClose();
                },
            });
        }

        if (child.type === "button") {
            return cloneElement(child, {
                onClick: (e) => {
                    child.props.onClick?.(e);
                    onClose();
                },
            });
        }

        if (child.props?.children) {
            return cloneElement(child, {
                children: wrapWithClose(child.props.children, onClose),
            });
        }

        return child;
    });
}

export default function NavDropdown({ trigger, children, align = "start", className = "" }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const close = () => setOpen(false);

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) close();
        };
        const onKey = (e) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const alignClass = align === "end" ? "end-0" : "start-0";

    return (
        <div className={`relative ${className}`} ref={ref}>
            <div onClick={() => setOpen((o) => !o)} onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}>
                {trigger}
            </div>
            {open && (
                <div
                    className={`absolute top-full mt-2 ${alignClass} z-50 min-w-[12rem] bg-white rounded-lg shadow-lg border border-gray-100 py-2`}
                    role="menu"
                >
                    {wrapWithClose(children, close)}
                </div>
            )}
        </div>
    );
}
