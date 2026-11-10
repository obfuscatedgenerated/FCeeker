import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useEffect, useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Ellipsis, Play} from "lucide-react";
import {LoadingSpinner} from "./components/LoadingSpinner.tsx";
import {Group, Panel, Separator} from "react-resizable-panels";

export const App = () => {
    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);
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

    return (
        <main className="h-screen flex flex-col">
            <Header/>

            <div className={`flex-1 min-h-0 grid transition-[grid-template-columns] duration-300 ${sidebar_visible ? "grid-cols-[2fr_1fr]" : "grid-cols-[1fr_0fr]"}`}>
                <Group orientation="vertical">
                    <Panel>
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

                    <Panel>
                        <CodeEditor
                            title="Input Word"
                            className="h-full"
                            value={input_word}
                            on_change={setInputWord}
                        />
                    </Panel>
                </Group>

                <ResultsSidebar visible={sidebar_visible} on_close={() => setSidebarVisible(false)} />
            </div>
        </main>
    );
}

// TODO: mobile layout
