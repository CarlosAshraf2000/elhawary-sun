export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <nav className="flex justify-center gap-2 mt-10 flex-wrap" aria-label="Pagination">
            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`min-w-[2.5rem] h-10 rounded font-bold transition ${
                        p === page ? "bg-gold text-black" : "bg-white border border-gray-200 hover:border-gold"
                    }`}
                >
                    {p}
                </button>
            ))}
        </nav>
    );
}
