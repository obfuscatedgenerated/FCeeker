import CodeMirror from "@uiw/react-codemirror";
import {githubDark, githubLight} from "@uiw/codemirror-theme-github";
import {useMediaQuery} from "../hooks/useMediaQuery.ts";

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

    return (
        <CodeMirror
            className={className}
            value={value}
            onChange={on_change}
            theme={dark_mode ? githubDark : githubLight}
        />
    );
}
