export default function FloatingShapes({ className = "" }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gold/10 blur-2xl animate-float" />
            <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float-delay" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-gold/20 rotate-45 animate-float opacity-40" />
            <div className="absolute top-20 left-1/4 w-16 h-16 bg-gold/15 rounded-lg rotate-12 animate-float-delay" />
        </div>
    );
}
