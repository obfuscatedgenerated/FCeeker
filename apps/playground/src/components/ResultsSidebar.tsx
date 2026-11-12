import {X} from "lucide-react";
import {useExecution} from "../contexts/ExecutionContext.tsx";
import {LoadingSpinner} from "./LoadingSpinner.tsx";

interface ResultsSidebarProps {
    visible: boolean;
    on_close: () => void;
}

const STEP_MS = 120;

const RowSkeleton = ({cols}: {cols: number}) => (
    <tr>
        {[...Array(cols)].map((_, col_idx) => {
            return (
                <td key={col_idx}>
                    <div
                        className="motion-reduce:animate-none block w-5/6 bg-base-content/20 animate-chase h-[0.75lh] rounded"
                        style={{
                            animationDelay: `${col_idx * STEP_MS}ms`,
                        }}
                    />
                </td>
            );
        })}
    </tr>
);

export const ResultsSidebar = ({
    visible,
    on_close,
}: ResultsSidebarProps) => {
    const {running, results, variables} = useExecution();

    return (
        <aside inert={!visible} className="bg-base-200 min-w-0 min-h-0 overflow-hidden h-full">
            <div className="min-w-80 h-full p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-title font-semibold text-2xl">Results</h2>

                    <button className="cursor-pointer" onClick={on_close}>
                        <X />
                    </button>
                </div>

                <div className="flex items-center justify-between w-full">
                    {results.n_rows + " results"}

                    {running && <LoadingSpinner />}
                </div>

                <div className="overflow-auto flex-1 min-h-0">
                    {variables && (
                        <table className="table table-pin-rows w-full">
                            <thead>
                                <tr>
                                    {variables.map(varname => (
                                        <th key={varname}>
                                            {varname}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.row_data.current.map((row, row_idx) => (
                                    <tr key={row_idx}>
                                        {variables.map(varname => (
                                            <td key={varname} className="font-mono whitespace-nowrap">
                                                {row.get(varname) || <span title="Empty string" className="opacity-40 font-bold">ϵ</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {running && (
                                    results.n_rows > 0 ? <RowSkeleton cols={variables.length} />
                                    : [...Array(10)].map((_, idx) => <RowSkeleton key={idx} cols={variables.length} />)
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </aside>
    )
}
