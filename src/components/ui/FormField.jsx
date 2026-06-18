export default function FormField({
    label,
    id,
    type = "text",
    as = "input",
    className = "",
    ...props
}) {
    const fieldId = id || props.name;
    const baseClass =
        "w-full border border-gray-300 rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

    const Field = as;

    return (
        <div className={className}>
            <label htmlFor={fieldId} className="block mb-2 font-semibold text-gray-800">
                {label}
            </label>
            <Field
                id={fieldId}
                type={as === "input" ? type : undefined}
                className={baseClass}
                {...props}
            />
        </div>
    );
}
