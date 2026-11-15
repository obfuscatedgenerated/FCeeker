import {Dialog} from "./Dialog.tsx";
import {setting_categories, setting_presentations, type SettingKey, useSetting} from "../contexts/SettingsContext.tsx";
import {useMemo} from "react";

const ToggleWidget = ({setting_key}: {setting_key: SettingKey}) => {
    const [value, setValue] = useSetting(setting_key);

    return <input type="checkbox" className="toggle" checked={value} onChange={(e) => setValue(e.target.checked)} />;
}

const SettingWidget = ({setting_key}: {setting_key: SettingKey}) => {
    const presentation = useMemo(() => setting_presentations[setting_key], [setting_key]);

    const widget = useMemo(() => {
        switch (presentation.widget) {
            case "toggle":
                return <ToggleWidget setting_key={setting_key} />;
        }
    }, [presentation]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <h3 className="text-lg">{presentation.label}</h3>
                <p className="opacity-70">{presentation.description}</p>
            </div>

            {widget}
        </div>
    );
}

interface SettingsCategoryProps {
    name: string;
    keys: SettingKey[];
}

const SettingsCategory = ({name, keys}: SettingsCategoryProps) => (
    <div className="flex flex-col gap-3">
        <h2 className="text-xl font">{name}</h2>

        {keys.map((key) => <SettingWidget key={key} setting_key={key} />)}
    </div>
);

export const SettingsDialog = ({open, on_closed}: { open: boolean, on_closed: () => void }) => (
    <Dialog title="Settings" open={open} on_closed={on_closed}>
        <div className="pt-2 flex flex-col gap-6">
            {setting_categories.map((category) => <SettingsCategory {...category} />)}
        </div>
    </Dialog>
);
