export default function GlassPanel({ children, variant = "light", className = "", as, ...props }) {
    const variants = {
        light: "glass-card-light",
        dark: "glass-card-dark shadow-3d-lg text-white",
        gold: "glass-card-gold",
    };

    const Tag = as || "div";

    return (
        <Tag className={`${variants[variant]} ${className}`} {...props}>
            {children}
        </Tag>
    );
}
