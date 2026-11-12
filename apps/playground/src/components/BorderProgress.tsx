export const BorderProgress = ({percentage, className = ""}: {percentage: number, className?: string}) => (
    <div
        className={`pointer-events-none absolute inset-0 border-2 ${percentage >= 1 ? "border-success" : "border-primary"} rounded-[inherit] transition-[clip-path,border-color] duration-200 ${className}`}
        style={{clipPath: `inset(0 ${(1 - percentage) * 100}% 0 0)`}}
    />
);
