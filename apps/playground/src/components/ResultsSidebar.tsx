import {X} from "lucide-react";

interface ResultsSidebarProps {
    visible: boolean;
    on_close: () => void;
}

export const ResultsSidebar = ({
    visible,
    on_close
}: ResultsSidebarProps) => {
    return (
        <aside inert={!visible} className="bg-base-200 min-w-0 min-h-0 overflow-hidden h-full">
            <div className="min-w-80 p-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-title font-semibold text-2xl">Results</h2>

                    <button className="cursor-pointer" onClick={on_close}>
                        <X />
                    </button>
                </div>
            </div>
        </aside>
    )
}
