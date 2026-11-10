import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useState} from "react";
import {ExecutionSidebar} from "./components/ExecutionSidebar.tsx";

export const App = () => {
    const [value, setValue] = useState("");

    return (
        <main className="h-screen flex flex-col">
            <Header/>

            <div className="h-full flex items-center justify-center">
                <CodeEditor className="h-full flex-1" value={value} on_change={setValue} />
                <ExecutionSidebar />
            </div>
        </main>
    );
}
