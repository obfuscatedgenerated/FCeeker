import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useEffect, useRef, useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Ellipsis, Play} from "lucide-react";
import {LoadingSpinner} from "./components/LoadingSpinner.tsx";
import {Group, Panel, type PanelImperativeHandle, Separator} from "react-resizable-panels";

export const App = () => {
    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);
    const sidebar_panel_ref = useRef<PanelImperativeHandle>(null);

    const [query_running, setQueryRunning] = useState(false);

    // dummy for now
    // TODO: or should the sidebar become visible right away to show progress and real time results?
    useEffect(() => {
        if (query_running) {
            setTimeout(() => {
                setQueryRunning(false);
                setSidebarVisible(true);
            }, 1000);
        }
    }, [query_running]);

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
            <Header/>

            <Group className="*:transition-[flex-grow]">
                <Panel>
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

                        <Separator className="bg-base-300 flex items-center justify-center hover:bg-base-200 transition-colors">
                            <Ellipsis />
                        </Separator>

                        <Panel minSize="10%">
                            <CodeEditor
                                title="Input Word"
                                className="h-full"
                                value={input_word}
                                on_change={setInputWord}
                            />
                        </Panel>
                    </Group>
                </Panel>

                <Panel panelRef={sidebar_panel_ref} collapsible minSize="20%" defaultSize={0} onResize={() => {
                    if (sidebar_panel_ref.current.isCollapsed()) {
                        setSidebarVisible(false);
                    }
                }}>
                    <ResultsSidebar visible={sidebar_visible} on_close={() => setSidebarVisible(false)} />
                </Panel>
            </Group>
        </main>
    );
}

// TODO: mobile layout
