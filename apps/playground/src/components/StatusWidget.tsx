import {PanelRightOpen, X} from "lucide-react";
import {BorderProgress} from "./BorderProgress.tsx";
import {useExecution} from "../contexts/ExecutionContext.tsx";
import {useMemo} from "react";
import {LoadingSpinner} from "./LoadingSpinner.tsx";

interface StatusWidgetProps {
    open_sidebar: () => void;
    sidebar_visible: boolean;
}

export const StatusWidget = ({sidebar_visible, open_sidebar}: StatusWidgetProps) => {
    const {progress, running, results} = useExecution();

    const percentage = useMemo(() => progress !== undefined ? (progress.value / progress.total) : 0, [progress]);

    return (
        <div
            inert={!running}
            aria-hidden={!running}
            className={`absolute bottom-7 left-1/2 -translate-x-1/2 bg-base-100 rounded-3xl w-2/3 max-w-xl h-15 px-3 py-1 flex items-center justify-between transition-opacity ${running ? "opacity-100" : "opacity-0"}`}
        >
            <LoadingSpinner />

            {progress && (
                <span>
                    {progress.value} / {progress.total} assignments ({(percentage * 100).toFixed(2)}%)
                </span>
            )}

            <span>
                {results.n_rows} found
            </span>

            <div className="flex gap-2">
                {!sidebar_visible && (
                    <button className="flex items-center justify-center cursor-pointer" onClick={open_sidebar} title="Reopen results sidebar">
                        <PanelRightOpen />
                    </button>
                )}

                <button className="flex items-center justify-center cursor-pointer text-error" onClick={() => {}} title="Cancel query">
                    <X />
                </button>
            </div>

            <BorderProgress percentage={percentage} />
        </div>
    );
}
