import {Dialog} from "./Dialog.tsx";

const NonApplicable = () => (
    <td className="opacity-20" title="N/A">-</td>
);

const NameCell = ({children}: { children: string }) => (
    <td className="font-bold">{children}</td>
);

const CodeInline = ({children}: { children: string }) => (
    <code className="font-mono bg-base-200 px-1 rounded">{children}</code>
);

const CodeCell = ({children}: { children: string }) => (
    <td><CodeInline>{children}</CodeInline></td>
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
                            <td><CodeInline>ε</CodeInline>, <CodeInline>ϵ</CodeInline></td>
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
                            <td><CodeInline>UNIV</CodeInline>, <CodeInline>INPUT</CodeInline></td>
                            <CodeCell>𝔲</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Equals</NameCell>
                            <CodeCell>=</CodeCell>
                            <NonApplicable/>
                            <CodeCell>≐</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Negation</NameCell>
                            <CodeCell>!</CodeCell>
                            <CodeCell>NOT</CodeCell>
                            <CodeCell>¬</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Conjunction</NameCell>
                            <CodeCell>&&</CodeCell>
                            <CodeCell>AND</CodeCell>
                            <CodeCell>∧</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Disjunction</NameCell>
                            <CodeCell>||</CodeCell>
                            <CodeCell>OR</CodeCell>
                            <CodeCell>∨</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Universal quantifier</NameCell>
                            <NonApplicable/>
                            <CodeCell>FORALL x, y:</CodeCell>
                            <CodeCell>∀ x, y:</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>Existential quantifier</NameCell>
                            <NonApplicable/>
                            <CodeCell>EXISTS x, y:</CodeCell>
                            <CodeCell>∃ x, y:</CodeCell>
                        </tr>
                        <tr>
                            <NameCell>In constraint (regex)</NameCell>
                            <NonApplicable/>
                            <CodeCell>IN</CodeCell>
                            <td><CodeInline>∈̇</CodeInline>, <CodeInline>∈</CodeInline></td>
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

// TODO: option to copy preferred unicode form to clipboard (i.e. the first one given)
// TODO: option to atuoamtically replace ascii forms with unicode forms in the query input
