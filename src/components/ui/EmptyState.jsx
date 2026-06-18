import { useLocale } from "../../hooks/useLocale";

export default function EmptyState({ message }) {
    const { t } = useLocale();
    const text = message ?? t("common.empty");

    return (
        <div className="text-center py-16 text-gray-600">
            <p className="text-lg">{text}</p>
        </div>
    );
}
