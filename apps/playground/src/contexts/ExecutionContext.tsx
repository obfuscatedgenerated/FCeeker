import {type TabularData, useTabularData} from "../hooks/useTabularData.ts";
import {createContext, useCallback, useContext, useRef, useState} from "react";
import {execute_fc_in_worker, parse_fc} from "../util/runner.ts";
import {collect_free_variables, type QueryResult} from "@fceeker/core";

export interface ExecutionContextType {
    running: boolean;
    run_query: (fc_query: string, input_word: string) => Promise<QueryResult>;
    cancel: () => void;
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

    const abort_controller_ref = useRef<AbortController | null>(null);

    const run_query = useCallback(
        async (fc_query: string, input_word: string) => {
            const parsed = parse_fc(fc_query);
            if (!parsed.success) {
                // TODO: handle error highlight
                return;
            }

            console.log(parsed.ast);

            if (abort_controller_ref.current) {
                // abort existing execution
                abort_controller_ref.current.abort();
            }

            setRunning(true);
            setProgressTotal(undefined);
            setProgressValue(0);

            results.clear_rows();
            setVariables([...collect_free_variables(parsed.ast)]);

            const controller = new AbortController();
            abort_controller_ref.current = controller;

            controller.signal.addEventListener("abort", () => {
                abort_controller_ref.current = null;
                setRunning(false);

            })

            const result = await execute_fc_in_worker(parsed.ast, input_word, {
                progress_start: setProgressTotal,
                progress_tick: (count) => setProgressValue(next => (next + (count ?? 1))),
                on_found: (assignments) => {
                    results.add_row(assignments);
                },
                abort_signal: controller.signal
            });
            abort_controller_ref.current = null;

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

            return result;
        },
        [results]
    );

    const cancel = useCallback(
        () => {
            const controller = abort_controller_ref.current;
            if (!controller) {
                return;
            }

            controller.abort();
        },
        []
    );

    return (
        <ExecutionContext.Provider value={{
            running,
            progress: running && progress_total !== undefined ? {value: progress_value, total: progress_total} : undefined,
            run_query,
            cancel,
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
