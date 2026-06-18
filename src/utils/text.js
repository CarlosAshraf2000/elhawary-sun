export function truncateDescription(text, max = 80) {
    if (!text) return "";
    return text.length > max ? `${text.substring(0, max)}...` : text;
}
