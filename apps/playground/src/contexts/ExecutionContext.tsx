import {type TabularData, useTabularData} from "../hooks/useTabularData.ts";
import {createContext, useCallback, useContext, useState} from "react";
import {execute_fc_in_worker, parse_fc} from "../util/runner.ts";
import {collect_free_variables, type QueryResult} from "@fceeker/core";

export interface ExecutionContextType {
    running: boolean;
    run_query: (fc_query: string, input_word: string) => Promise<QueryResult>;
    progress?: {
        value: number;
        total: number;
    };
    results: TabularData<ReadonlyMap<string, string>>;
    variables?: string[];
}

const ExecutionContext = createContext<ExecutionContextType | null>(null);

export const ExecutionProvider = ({children}: {children: React.ReactNode}) => {
    const [running, setRunning] = useState(false);

    const results = useTabularData<ReadonlyMap<string, string>>();
    const [variables, setVariables] = useState<string[] | undefined>(undefined);

    const [progress_total, setProgressTotal] = useState<number | undefined>(undefined);
    const [progress_value, setProgressValue] = useState(0);

    const run_query = useCallback(
        async (fc_query: string, input_word: string) => {
            const parsed = parse_fc(fc_query);
            if (!parsed.success) {
                // TODO: handle error highlight
                return;
            }

            console.log(parsed.ast);

            setRunning(true);

            results.clear_rows();
            setVariables([...collect_free_variables(parsed.ast)]);

            const result = await execute_fc_in_worker(parsed.ast, input_word, {
                progress_start: setProgressTotal,
                progress_tick: (count) => setProgressValue(next => (next + (count ?? 1))),
                on_found: (assignments) => {
                    results.add_row(assignments);
                }
            });

            setRunning(false);
            setProgressTotal(undefined);
            console.log(result);

            if (result.type === "error") {
                console.error(result.message);
            } else if (result.type === "boolean") {
                // TODO: handle
                console.log(`Query result: ${result.result}`);
            } else {
                results.set_rows(Array.from(result.result));
            }

            if (result.warnings.length > 0) {
                // TODO: show in ui
                console.warn("Warnings:");
                for (const warning of result.warnings) {
                    console.warn(`- ${warning}`);
                }
            }

            // TODO: cancelation

            return result;
        },
        [results]
    );

    return (
        <ExecutionContext.Provider value={{
            running,
            progress: running && progress_total !== undefined ? {value: progress_value, total: progress_total} : undefined,
            run_query,
            results,
            variables
        }}>
            {children}
        </ExecutionContext.Provider>
    );
}

export const useExecution = () => {
    const value = useContext(ExecutionContext);
    if (!value) {
        throw new Error("useExecution must be used within an ExecutionProvider");
    }

    return value;
}
