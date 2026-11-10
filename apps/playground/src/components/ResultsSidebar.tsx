interface ResultsSidebarProps {
    visible: boolean;
}

export const ResultsSidebar = ({
    visible
}: ResultsSidebarProps) => {
    return (
        <aside inert={!visible} className="bg-base-200 min-w-0 min-h-0 overflow-hidden">
            <div className="min-w-80 p-3">
                <h2 className="font-title font-semibold text-2xl">Results</h2>
            </div>
        </aside>
    )
}
