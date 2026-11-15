import {Dialog} from "./Dialog.tsx";
import {Check, Clipboard} from "lucide-react";
import {useCallback, useState} from "react";

const NonApplicable = () => (
    <td className="opacity-20" title="N/A">-</td>
);

const NameCell = ({children}: { children: string }) => (
    <td className="font-bold">{children}</td>
);

const CopyableCell = ({children, value}: { children: React.ReactNode, value: string }) => {
    const [tick, setTick] = useState(false);

    const copy = useCallback(
        async () => {
            await navigator.clipboard.writeText(value);
            setTick(true);
            setTimeout(() => setTick(false), 3000);
        },
        [value]
    );

    return (
        <td className="flex items-center gap-2">
            {children}

            <button
                className="ml-auto btn btn-sm btn-outline btn-ghost p-1"
                onClick={copy}
                title="Copy to clipboard"
            >
                <Clipboard className={`w-4 transition-opacity ${tick ? "opacity-0" : "opacity-100"}`}/>
                <Check className={`w-4 text-success absolute transition-opacity ${tick ? "opacity-100" : "opacity-0"}`}/>
            </button>
        </td>
    );
}

const CodeInline = ({children}: { children: string }) => (
    <code className="font-mono bg-base-200 px-1 rounded">{children}</code>
);

const CodeCell = ({children, copyable = false}: { children: string, copyable?: boolean }) => {
    if (copyable) {
        return (
            <CopyableCell value={children}>
                <CodeInline>{children}</CodeInline>
            </CopyableCell>
        );
    } else {
        return (
            <td>
                <CodeInline>{children}</CodeInline>
            </td>
        );
    }
};

const Alternative = ({children}: { children: React.ReactNode }) => (
    <span className="text-xs opacity-60">(or {children})</span>
);

export const HelpDialog = ({open, on_closed}: { open: boolean, on_closed: () => void }) => (
    <Dialog title="Help" open={open} on_closed={on_closed} className="overflow-x-clip">
        <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg">Welcome to FCeeker Playground!</h2>

            <p>
                This is a web-based interface for querying strings with <a href="https://arxiv.org/abs/1912.06110" target="_blank" className="text-blue-500 underline">FC[REG]</a>.
            </p>

            <h3 className="font-bold">Cheatsheet</h3>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Construct</th>
                            <th>ASCII form</th>
                            <th>Keyword form(s)</th>
                            <th>Unicode form(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <NameCell>String</NameCell>
                            <CodeCell>"abc"</CodeCell>
                            <NonApplicable/>
                            <NonApplicable/>
                        </tr>
                        <tr>
                            <NameCell>Empty string</NameCell>
                            <CodeCell>""</CodeCell>
                            <CodeCell>EMPTY</CodeCell>
                            <CopyableCell value="ε">
                                <CodeInline>ε</CodeInline> <Alternative><CodeInline>ϵ</CodeInline></Alternative>
                            </CopyableCell>
                        </tr>
                        <tr>
                            <NameCell>Variable</NameCell>
                            <CodeCell>x</CodeCell>
                            <NonApplicable/>
                            <NonApplicable/>
                        </tr>
                        <tr>
                            <NameCell>Universe variable</NameCell>
                            <CodeCell>$U</CodeCell>
                            <td><CodeInline>UNIV</CodeInline> <Alternative><CodeInline>INPUT</CodeInline></Alternative></td>
                            <CodeCell copyable>𝔲</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Equals</NameCell>
                            <CodeCell>=</CodeCell>
                            <NonApplicable/>
                            <CodeCell copyable>≐</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Negation</NameCell>
                            <CodeCell>!</CodeCell>
                            <CodeCell>NOT</CodeCell>
                            <CodeCell copyable>¬</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Conjunction</NameCell>
                            <CodeCell>&&</CodeCell>
                            <CodeCell>AND</CodeCell>
                            <CodeCell copyable>∧</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Disjunction</NameCell>
                            <CodeCell>||</CodeCell>
                            <CodeCell>OR</CodeCell>
                            <CodeCell copyable>∨</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Universal quantifier</NameCell>
                            <NonApplicable/>
                            <CodeCell>FORALL x, y:</CodeCell>
                            <CodeCell copyable>∀ x, y:</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Existential quantifier</NameCell>
                            <NonApplicable/>
                            <CodeCell>EXISTS x, y:</CodeCell>
                            <CodeCell copyable>∃ x, y:</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>In constraint (regex)</NameCell>
                            <NonApplicable/>
                            <CodeCell>IN</CodeCell>
                            <CopyableCell value="∈̇">
                                <CodeInline>∈̇</CodeInline> <Alternative><CodeInline>∈</CodeInline></Alternative>
                            </CopyableCell>
                        </tr>
                        <tr>
                            <NameCell>Regular expression</NameCell>
                            <CodeCell>/abc/</CodeCell>
                            <NonApplicable/>
                            <NonApplicable/>
                        </tr>
                        <tr>
                            <NameCell>Parentheses/subformula</NameCell>
                            <CodeCell>(...)</CodeCell>
                            <NonApplicable/>
                            <NonApplicable/>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Dialog>
);

// TODO: option to automatically replace ascii forms with unicode forms in the query input
// TODO: shortcuts to invoke the unicode? i suppose replacement covers it though
