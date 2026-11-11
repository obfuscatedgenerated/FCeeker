import {X} from "lucide-react";
import type {TabularData} from "../hooks/useTabularData.ts";
import {useMemo} from "react";

interface ResultsSidebarProps {
    visible: boolean;
    on_close: () => void;
    results?: TabularData<ReadonlyMap<string, string>>;
}

export const ResultsSidebar = ({
    visible,
    on_close,
    results
}: ResultsSidebarProps) => {
    // TODO: more efficient dep since the first row theoretically has all vars
    const variables = useMemo(() => results && results.n_rows > 0 && Array.from(results.row_data.current[0].keys()), [results, results.n_rows]);

    return (
        <aside inert={!visible} className="bg-base-200 min-w-0 min-h-0 overflow-hidden h-full">
            <div className="min-w-80 h-full p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-title font-semibold text-2xl">Results</h2>

                    <button className="cursor-pointer" onClick={on_close}>
                        <X />
                    </button>
                </div>

                {results && results.n_rows + " results"}

                <div className="overflow-auto flex-1 min-h-0">
                    {results && (
                        <table className="table table-pin-rows w-full">
                            <thead>
                                <tr>
                                    {variables.map(varname => (
                                        <th>
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
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </aside>
    )
}
