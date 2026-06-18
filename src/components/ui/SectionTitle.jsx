export default function SectionTitle({ children, className = "" }) {
    return (
        <div className={`text-center mb-12 ${className}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-3">{children}</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>
    );
}
