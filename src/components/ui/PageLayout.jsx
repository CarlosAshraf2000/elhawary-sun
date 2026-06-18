import { useLocale } from "../../hooks/useLocale";

export default function PageLayout({ title, children, className = "" }) {
    const { dir } = useLocale();

    return (
        <section className={`py-16 md:py-20 bg-gray-50 min-h-[60vh] ${className}`} dir={dir}>
            <div className="max-w-7xl mx-auto px-6">
                {title && (
                    <h1 className="text-3xl md:text-4xl font-bold text-gold text-center mb-10">
                        {title}
                    </h1>
                )}
                {children}
            </div>
        </section>
    );
}
