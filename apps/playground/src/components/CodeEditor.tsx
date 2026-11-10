import CodeMirror from "@uiw/react-codemirror";
import {githubDark, githubLight} from "@uiw/codemirror-theme-github";
import {useMediaQuery} from "../hooks/useMediaQuery.ts";
import {FolderOpen, Save} from "lucide-react";

interface CodeEditorProps {
    value: string;
    on_change: (value: string) => void;
    title?: string;
    className?: string;
    extra_buttons?: React.ReactNode;
}

export const CodeEditor = ({
    value,
    on_change,
    title,
    className = "",
    extra_buttons = null
}: CodeEditorProps) => {
    const dark_mode = useMediaQuery("(prefers-color-scheme: dark)");

    // TODO: actually implement the buttons

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex gap-1 items-center bg-base-100 px-2 py-1">
                {title && <h2 className="font-title text-lg mr-4">{title}</h2>}

                <button className="btn flex gap-2">
                    <FolderOpen className="w-4" />
                    Open file

                    {/*<kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">O</kbd>*/}
                </button>

                <button className="btn flex gap-2">
                    <Save className="w-4" />
                    Download file

                    {/*<kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">S</kbd>*/}
                </button>

                {extra_buttons}
            </div>

            <CodeMirror
                className="flex-1 min-h-0"
                value={value}
                onChange={on_change}
                theme={dark_mode ? githubDark : githubLight}
            />
        </div>
    );
}
