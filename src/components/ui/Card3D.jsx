import { useRef } from "react";

export default function Card3D({ children, className = "", intensity = 12 }) {
    const ref = useRef(null);

    const handleMove = (e) => {
        if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.transform = `rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(10px)`;
    };

    const handleLeave = () => {
        if (ref.current) ref.current.style.transform = "";
    };

    return (
        <div className={`perspective-scene ${className}`}>
            <div
                ref={ref}
                className="card-tilt transition-transform duration-300 ease-out h-full"
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{ transformStyle: "preserve-3d" }}
            >
                {children}
            </div>
        </div>
    );
}
