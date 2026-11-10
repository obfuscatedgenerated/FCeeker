import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useEffect, useRef, useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Play} from "lucide-react";
import {LoadingSpinner} from "./components/LoadingSpinner.tsx";
import {Group, Panel, type PanelImperativeHandle} from "react-resizable-panels";
import {StyledSeparator} from "./components/StyledSeparator.tsx";
import {StatusWidget} from "./components/StatusWidget.tsx";

export const App = () => {
    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);
    const [sidebar_animate, setSidebarAnimate] = useState(false);
    const sidebar_panel_ref = useRef<PanelImperativeHandle>(null);

    const [query_running, setQueryRunning] = useState(false);

    // dummy for now
    // TODO: or should the sidebar become visible right away to show progress and real time results?
    useEffect(() => {
        if (query_running) {
            setSidebarVisible(true);
            setSidebarAnimate(true);

            setTimeout(() => {
                setQueryRunning(false);
            }, 1000);
        }
    }, [query_running]);

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
                                title="FC Query"
                                className="h-full"
                                value={fc_query}
                                on_change={setFCQuery}
                                extra_buttons={
                                    <>
                                        <button className="ml-auto btn flex gap-2" disabled={query_running} onClick={() => setQueryRunning(true)}>
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
                            />
                        </Panel>

                        <StyledSeparator />

                        <Panel minSize="10%">
                            <CodeEditor
                                title="Input Word"
                                className="h-full"
                                value={input_word}
                                on_change={setInputWord}
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
                    <ResultsSidebar visible={sidebar_visible} on_close={() => {
                        setSidebarVisible(false)
                        setSidebarAnimate(true);
                    }} />
                </Panel>
            </Group>
        </main>
    );
}

// TODO: mobile layout
