import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useCallback, useEffect, useEffectEvent, useMemo, useRef, useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Play} from "lucide-react";
import {LoadingSpinner} from "./components/LoadingSpinner.tsx";
import {Group, Panel, type PanelImperativeHandle} from "react-resizable-panels";
import {StyledSeparator} from "./components/StyledSeparator.tsx";
import {fc_formaliser, fc_linter, fc_special_highlights, fc_syntax_highlighter} from "./util/extensions.ts";
import {lintGutter} from "@codemirror/lint";
import {ExecutionProvider, useExecution} from "./contexts/ExecutionContext.tsx";
import {StatusWidget} from "./components/StatusWidget.tsx";
import {SettingsProvider, useSetting} from "./contexts/SettingsContext.tsx";

export const App = () => (
    <main className="h-screen flex flex-col">
        <SettingsProvider>
            <Header/>

            <ExecutionProvider>
                <AppInternal />
            </ExecutionProvider>
        </SettingsProvider>
    </main>
);

const AppInternal = () => {
    const {run_query, running} = useExecution();

    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);
    const [sidebar_animate, setSidebarAnimate] = useState(false);
    const sidebar_panel_ref = useRef<PanelImperativeHandle>(null);

    const run_query_shortcut = useEffectEvent(() => run_query(fc_query, input_word));

    const animate_open_sidebar = useCallback(
        () => {
            setSidebarVisible(true);
            setSidebarAnimate(true);
        },
        []
    );

    const [auto_open_results] = useSetting("auto_open_results");

    // open sidebar when a run starts if setting is enabled
    useEffect(() => {
        if (!running || !auto_open_results) {
            return;
        }

        animate_open_sidebar();
    }, [running, animate_open_sidebar, auto_open_results]);

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

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === "F8") {
                e.preventDefault();
                run_query_shortcut();
            }
        }

        window.addEventListener("keydown", listener);

        return () => window.removeEventListener("keydown", listener);
    }, []);

    const [auto_replace] = useSetting("replace_with_unicode");

    const lint_gutter = useMemo(() => lintGutter(), []);
    const fc_editor_extensions = useMemo(() => {
        const base = [fc_syntax_highlighter, fc_special_highlights, fc_linter, lint_gutter];
        if (auto_replace) {
            base.push(fc_formaliser);
        }
        return base;
    }, [auto_replace, lint_gutter])

    return (
        <Group className={`${sidebar_animate ? "not-motion-reduce:*:transition-[flex-grow] not-motion-reduce:*:duration-300" : ""}`}>
            <Panel className="relative">
                <Group orientation="vertical">
                    <Panel minSize="10%">
                        <CodeEditor
                            title="FC[REG] Query"
                            className="h-full"
                            value={fc_query}
                            on_change={setFCQuery}
                            readonly={running}
                            extra_buttons={
                                <>
                                    <button className="ml-auto btn flex gap-2" disabled={running} onClick={run_query_shortcut}>
                                        {running ? (
                                            <>
                                                Running...
                                                <LoadingSpinner/>
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4"/>
                                                Run query

                                                <kbd className="kbd">F8</kbd>
                                            </>
                                        )}
                                    </button>
                                </>
                            }
                            file_ext=".fc"
                            extensions={fc_editor_extensions}
                        />
                    </Panel>

                    <StyledSeparator/>

                    <Panel minSize="10%">
                        <CodeEditor
                            title="Input Word"
                            className="h-full"
                            value={input_word}
                            on_change={setInputWord}
                            readonly={running}
                            file_ext=".txt"
                        />
                    </Panel>
                </Group>

                <StatusWidget sidebar_visible={sidebar_visible} open_sidebar={animate_open_sidebar} />
            </Panel>

            {sidebar_visible && <StyledSeparator vertical/>}

            <Panel panelRef={sidebar_panel_ref} collapsible minSize="20%" defaultSize={0} onResize={() => {
                if (sidebar_panel_ref.current.isCollapsed()) {
                    setSidebarVisible(false);
                }
            }}>
                <ResultsSidebar
                    visible={sidebar_visible}
                    on_close={() => {
                        setSidebarVisible(false)
                        setSidebarAnimate(true);
                    }}
                />
            </Panel>
        </Group>
    );
}

// TODO: mobile layout
// TODO: button to manually formalise the whole query
