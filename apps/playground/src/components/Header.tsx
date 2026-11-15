import {HelpCircle} from "lucide-react";
import {HelpDialog} from "./HelpDialog.tsx";
import {useState} from "react";

export const Header = () => {
    const [help_dialog_open, setHelpDialogOpen] = useState(false);

    return (
        <>
            <header className="p-3 bg-sky-950 h-16 flex items-center gap-4 text-white">
                <img src="/fceeker.svg" className="h-full" draggable={false} />

                <h1 className="font-title font-bold text-xl sm:text-3xl">FCeeker Playground</h1>

                <div className="ml-auto flex gap-2">
                    <button className="cursor-pointer" onClick={() => setHelpDialogOpen(true)} title="Help">
                        <HelpCircle className="w-6" />
                    </button>
                </div>
            </header>

            <HelpDialog open={help_dialog_open} on_closed={() => setHelpDialogOpen(false)} />
        </>
    );
}
