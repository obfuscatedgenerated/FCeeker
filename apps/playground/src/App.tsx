import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useState} from "react";
import {ResultsSidebar} from "./components/ResultsSidebar.tsx";
import {Play} from "lucide-react";

export const App = () => {
    const [fc_query, setFCQuery] = useState("");
    const [input_word, setInputWord] = useState("");

    const [sidebar_visible, setSidebarVisible] = useState(false);

    return (
        <main className="h-screen flex flex-col">
            <Header/>

            <div className="flex-1 min-h-0 flex">
                <div className="flex flex-col flex-1 min-h-0">
                    <CodeEditor
                        title="FC Query"
                        className="flex-1 min-h-0"
                        value={fc_query}
                        on_change={setFCQuery}
                        extra_buttons={
                            <>
                                <button className="ml-auto btn flex gap-2" onClick={() => setSidebarVisible(true)}>
                                    <Play className="w-4" />
                                    Run query

                                    <kbd className="kbd">F8</kbd>
                                </button>
                            </>
                        }
                    />

                    <CodeEditor
                        title="Input Word"
                        className="flex-1 min-h-0"
                        value={input_word}
                        on_change={setInputWord}
                    />
                </div>

                <ResultsSidebar visible={sidebar_visible} />
            </div>
        </main>
    );
}

// TODO: mobile layout
