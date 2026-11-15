import CodeMirror, {type Extension, type ViewUpdate} from "@uiw/react-codemirror";
import {githubDark, githubLight} from "@uiw/codemirror-theme-github";
import {useMediaQuery} from "../hooks/useMediaQuery.ts";
import {FolderOpen, Save} from "lucide-react";
import {useCallback, useRef} from "react";
import {forEachDiagnostic} from "@codemirror/lint";

interface CodeEditorProps {
    value: string;
    on_change: (value: string) => void;
    title?: string;
    readonly?: boolean;
    className?: string;
    extra_buttons?: React.ReactNode;
    file_ext: string;
    extensions?: Extension[];
    on_error_count_change?: (errors: number) => void;
}

export const CodeEditor = ({
    value,
    on_change,
    title,
    readonly = false,
    className = "",
    extra_buttons = null,
    file_ext,
    extensions,
    on_error_count_change
}: CodeEditorProps) => {
    const dark_mode = useMediaQuery("(prefers-color-scheme: dark)");

    const file_input_ref = useRef<HTMLInputElement | null>(null);
    const on_file_select = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) {
                return;
            }

            const file = e.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                on_change(reader.result as string);
            };

            reader.onerror = (e) => {
                console.error(e);
            };

            reader.readAsText(file);
        },
        []
    );

    const download_file = useCallback(
        async (text: string) => {
            const blob = new Blob(
                [ text ],
                {
                    type : "text/plain;charset=utf-8"
                }
            );

            // TODO: parametrise
            const suggested_name = `download${file_ext}`;

            if ("showSaveFilePicker" in window) {
                // on a good browser (chrome) that supports choosing where to save

                try {
                    const handle = await (window as any).showSaveFilePicker({
                        id: file_ext,
                        suggestedName: suggested_name,
                        types: [
                            {accept: { "*/*": [file_ext] } }
                        ]
                    });

                    // TODO: this handle reflects edits made. could replace open to use this and maybe sync real time?

                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    return;
                } catch (e) {
                    if (e.name === "AbortError") {
                        // cancelled by user, don't retry
                        return;
                    }

                    console.error(e);
                    // fallback to download
                }
            }

            // only supports blind downloads

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = suggested_name;

            a.click();
            URL.revokeObjectURL(url);
        },
        []
    );

    const error_count_ref = useRef(0);
    const handle_update = useCallback(
        (update: ViewUpdate) => {
            if (!on_error_count_change) {
                error_count_ref.current = 0;
                return;
            }

            const old_error_count = error_count_ref.current;
            let error_count = 0;
            forEachDiagnostic(update.state, (diag) => {
                if (diag.severity === "error") {
                    error_count++;
                }
            });

            if (old_error_count !== error_count) {
                error_count_ref.current = error_count;
                on_error_count_change(error_count);
            }
        },
        [on_error_count_change]
    );

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex gap-1 items-center bg-base-100 px-2 py-1">
                {title && <h2 className="font-title text-lg mr-4">{title}</h2>}

                <input ref={file_input_ref} type="file" className="hidden" accept={file_ext} onChange={on_file_select} />
                <button disabled={readonly} className="btn flex gap-2" onClick={() => file_input_ref.current?.click()}>
                    <FolderOpen className="w-4" />
                    Open file

                    {/*<kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">O</kbd>*/}
                </button>

                <button className="btn flex gap-2" onClick={() => download_file(value)}>
                    <Save className="w-4" />
                    Download file

                    {/*<kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">S</kbd>*/}
                </button>

                {extra_buttons}
            </div>

            <CodeMirror
                className={`flex-1 min-h-0 ${readonly ? "opacity-80" : ""}`}
                value={value}
                onChange={on_change}
                readOnly={readonly}
                theme={dark_mode ? githubDark : githubLight}
                extensions={extensions}
                onUpdate={handle_update}
            />
        </div>
    );
}
