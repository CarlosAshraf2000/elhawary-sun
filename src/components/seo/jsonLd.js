export function productJsonLd(product) {
    if (!product) return null;
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.imageUrl,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "EGP",
            availability: product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        },
    };
}

export function breadcrumbJsonLd(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
