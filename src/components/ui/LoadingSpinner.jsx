import { useLocale } from "../../hooks/useLocale";

export default function LoadingSpinner({ message }) {
    const { t } = useLocale();
    const text = message ?? t("common.loading");

    return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600" role="status">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p>{text}</p>
        </div>
    );
}
