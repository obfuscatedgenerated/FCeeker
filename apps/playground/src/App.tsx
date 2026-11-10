import {Header} from "./components/Header.tsx";
import {CodeEditor} from "./components/CodeEditor.tsx";
import {useState} from "react";

export const App = () => {
    const [value, setValue] = useState("");

    return (
        <main className="h-screen flex flex-col">
            <Header/>

            <CodeEditor className="flex-1" value={value} on_change={setValue} />
        </main>
    );
}
