import CodeMirror from "@uiw/react-codemirror";
import {githubDark, githubLight} from "@uiw/codemirror-theme-github";
import {useMediaQuery} from "../hooks/useMediaQuery.ts";
import {FolderOpen, Save} from "lucide-react";

interface CodeEditorProps {
    value: string;
    on_change: (value: string) => void;
    className?: string;
}

export const CodeEditor = ({
   value,
   on_change,
   className = ""
}: CodeEditorProps) => {
    const dark_mode = useMediaQuery("(prefers-color-scheme: dark)");

    // TODO: actually implement the buttons

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex gap-1 items-center bg-base-100">
                <button className="btn flex gap-2">
                    <FolderOpen className="w-4" />
                    Open file

                    <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">O</kbd>
                </button>
                <button className="btn flex gap-2">
                    <Save className="w-4" />
                    Download file

                    <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">S</kbd>
                </button>
            </div>

            <CodeMirror
                className="h-full"
                value={value}
                onChange={on_change}
                theme={dark_mode ? githubDark : githubLight}
            />
        </div>
    );
}
