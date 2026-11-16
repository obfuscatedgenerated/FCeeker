import {HelpCircle, Settings} from "lucide-react";
import {HelpDialog} from "./HelpDialog.tsx";
import {useState} from "react";
import {SettingsDialog} from "./SettingsDialog.tsx";

export const Header = () => {
    const [settings_dialog_open, setSettingsDialogOpen] = useState(false);
    const [help_dialog_open, setHelpDialogOpen] = useState(false);

    return (
        <>
            <header className="p-3 bg-sky-950 h-16 flex items-center gap-4 text-white">
                <img src="fceeker.svg" className="h-full" draggable={false} />

                <h1 className="font-title font-bold text-xl sm:text-3xl">FCeeker Playground</h1>

                <div className="ml-auto flex gap-5 px-2">
                    <button className="cursor-pointer" onClick={() => setSettingsDialogOpen(true)} title="Settings">
                        <Settings className="w-6" />
                    </button>

                    <button className="cursor-pointer" onClick={() => setHelpDialogOpen(true)} title="Help">
                        <HelpCircle className="w-6" />
                    </button>
                </div>
            </header>

            <SettingsDialog open={settings_dialog_open} on_closed={() => setSettingsDialogOpen(false)} />
            <HelpDialog open={help_dialog_open} on_closed={() => setHelpDialogOpen(false)} />
        </>
    );
}
