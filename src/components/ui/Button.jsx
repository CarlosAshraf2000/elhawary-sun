const variants = {
    primary:
        "bg-gold text-black hover:bg-goldDark focus-visible:ring-gold",
    secondary:
        "bg-dark text-white hover:bg-gray-800 focus-visible:ring-dark",
    outline:
        "border-2 border-gold text-gold hover:bg-gold hover:text-black focus-visible:ring-gold",
};

const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    as,
    ...props
}) {
    const classes = `inline-flex items-center justify-center font-bold rounded-btn transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

    if (as) {
        const AsComponent = as;
        return (
            <AsComponent className={classes} {...props}>
                {children}
            </AsComponent>
        );
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
