import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Play} from "lucide-react";
import {LoadingSpinner} from "./components/LoadingSpinner.tsx";
import {Group, Panel, type PanelImperativeHandle} from "react-resizable-panels";
import {StyledSeparator} from "./components/StyledSeparator.tsx";
import {StatusWidget} from "./components/StatusWidget.tsx";
import {execute_fc_in_worker, parse_fc} from "./util/runner.ts";
import {fc_linter, fc_special_highlights, fc_syntax_highlighter} from "./util/extensions.ts";
import {lintGutter} from "@codemirror/lint";
import {useTabularData} from "./hooks/useTabularData.ts";
import {collect_free_variables} from "@fceeker/core";

export const App = () => {
    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);
    const [sidebar_animate, setSidebarAnimate] = useState(false);
    const sidebar_panel_ref = useRef<PanelImperativeHandle>(null);

    const [query_running, setQueryRunning] = useState(false);

    const results = useTabularData<ReadonlyMap<string, string>>();
    const [variables, setVariables] = useState<string[]>([]);

    const run_query = useCallback(
        async () => {
            const parsed = parse_fc(fc_query);
            if (!parsed.success) {
                // TODO: handle error highlight
                return;
            }

            console.log(parsed.ast);

            setQueryRunning(true);
            setSidebarVisible(true);
            setSidebarAnimate(true);

            setVariables([...collect_free_variables(parsed.ast)]);

            const result = await execute_fc_in_worker(parsed.ast, input_word, {
                on_found: (assignments) => {
                    results.add_row(assignments);
                }
            });

            setQueryRunning(false);
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
        },
        [fc_query, input_word]
    );

    // clear animate flag once anim ends
    useEffect(() => {
        if (!sidebar_animate) {
            return;
        }

        const timer = setTimeout(() => {
            setSidebarAnimate(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [sidebar_animate]);

    useEffect(() => {
        const sidebar_panel = sidebar_panel_ref.current;
        if (!sidebar_panel) {
            return;
        }

        if (sidebar_visible) {
            sidebar_panel.expand();
        } else {
            sidebar_panel.collapse();
        }
    }, [sidebar_visible]);

    return (
        <main className="h-screen flex flex-col">
            <Header />

            <Group className={`${sidebar_animate ? "*:transition-[flex-grow] *:duration-300" : ""}`}>
                <Panel className="relative">
                    <Group orientation="vertical">
                        <Panel minSize="10%">
                            <CodeEditor
                                title="FC[REG] Query"
                                className="h-full"
                                value={fc_query}
                                on_change={setFCQuery}
                                readonly={query_running}
                                extra_buttons={
                                    <>
                                        <button className="ml-auto btn flex gap-2" disabled={query_running} onClick={run_query}>
                                            {query_running ? (
                                                <>
                                                    Running...
                                                    <LoadingSpinner />
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4" />
                                                    Run query

                                                    <kbd className="kbd">F8</kbd>
                                                </>
                                            )}
                                        </button>
                                    </>
                                }
                                extensions={[fc_syntax_highlighter, fc_special_highlights, fc_linter, lintGutter()]}
                            />
                        </Panel>

                        <StyledSeparator />

                        <Panel minSize="10%">
                            <CodeEditor
                                title="Input Word"
                                className="h-full"
                                value={input_word}
                                on_change={setInputWord}
                                readonly={query_running}
                            />
                        </Panel>
                    </Group>

                    {/*<StatusWidget />*/}
                </Panel>

                {sidebar_visible && <StyledSeparator vertical />}

                <Panel panelRef={sidebar_panel_ref} collapsible minSize="20%" defaultSize={0} onResize={() => {
                    if (sidebar_panel_ref.current.isCollapsed()) {
                        setSidebarVisible(false);
                    }
                }}>
                    <ResultsSidebar
                        results={results}
                        variables={variables}
                        visible={sidebar_visible}
                        on_close={() => {
                            setSidebarVisible(false)
                            setSidebarAnimate(true);
                        }}
                    />
                </Panel>
            </Group>
        </main>
    );
}

// TODO: mobile layout
